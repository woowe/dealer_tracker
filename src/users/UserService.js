(function(){
  'use strict';

  angular.module('users')
         .service('userService', ['$q', UserService]);

  /**
   * Users DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function UserService($q){
    var users = [];


    // Promise-based API
    return {
      loadAllDealers : function(id) {
        // Simulate async nature of real remote calls
        // var promise = new Promise(function(res, rej) {
        //
        // })
        return $q.when(co(function* () {
/*
SELECT Builder__c, Dealer_City_Location__c, Dealer_State_Location__c, pse__Tasks_Total_Percent_Complete_Points__c, Name, pse__Project_Status__c, pse__Project_Type__c, pse__Stage__c,
Trans_Call_Date__c, Zip__c, Content_Writer__c, DIS__c, Website_Designer__c, Actual_Go_Live_Date1__c, Projected_Go_Live_Date__c, Planned_Go_Live_Date__c FROM pse__Proj__c WHERE pse__Stage__c = 'In Preparation' AND Builder__c = '" + id + "'"
*/
            function convDate(date) { return new Date(date); }
            function team(id) { return { id: id, name: null, email: null }; }
            var query_res = yield sf_query({
                Select: [
                    /* project info */
                    { "Id": "id" },
                    { "pse__Tasks_Total_Percent_Complete_Points__c": "complete_percent" },
                    { "Name": "name" },
                    { "pse__Stage__c": "project_stage" },
                    /* imporant project dates */
                    {
                        "Projected_Go_Live_Date__c": "original_golive",
                        func: convDate
                    },
                    {
                        "Planned_Go_Live_Date__c": "updated_golive",
                        func: convDate
                    },
                    {
                        "Trans_Call_Date__c": "trans_call",
                        func: convDate
                    },
                    {
                        "Actual_Go_Live_Date1__c": "actual_golive",
                        func: convDate
                    },
                    /* location */
                    { "Dealer_City_Location__c": "dealer_city" },
                    { "Dealer_State_Location__c": "dealer_state" },
                    { "Zip__c": "dealer_zip" },
                    /* team */
                    { // just so i can use it in the WHERE claus
                        "Builder__c": "builder",
                        func: team
                    },
                    {
                        "Content_Writer__c": "writer",
                        func: team
                    },
                    {
                        "DIS__c": "dis",
                        func: team
                    },
                    {
                        "Website_Designer__c": "designer",
                        func: team
                    },
                ],
                From: "pse__Proj__c",
                Where: [
                    "pse__Stage__c = 'In Preparation' AND",
                    "Builder__c = '" + id + "'"
                ]
            });
            console.log(query_res);
            function getPerson(id) {
                return {
                    Select: [
                        { "Name": "name" },
                        { "Email": "email" },
                    ],
                    From: "Contact",
                    Where: [ "Id = '"+id+"'" ]
                };
            }
            for(var i = 0; i < query_res.length; ++i) {
              var record = query_res[i];
              var team_ids =  [ record.builder.id, record.writer.id, record.designer.id, record.dis.id ];
              //console.log(team_ids);
              var b = null, d = null, c = null, data = null;

              if(team_ids[0]) {
                b = sf_query(getPerson(team_ids[0]));
              }
              if(team_ids[1]) {
                c = sf_query(getPerson(team_ids[1]));
              }
              if(team_ids[2]) {
                d = sf_query(getPerson(team_ids[2]));
              }
              if(team_ids[3]) {
                data = sf_query(getPerson(team_ids[3]));
              }
              var tasks = sf_query({
                  Select: [
                      {
                          "Due_Date__c": "due_date",
                          func: convDate
                      },
                      { "Name": "name" },
                      {
                          "pse__Status__c" : "completed",
                          func: function(status) {
                              return (status === "Complete");
                          }
                      }
                  ],
                  From: "pse__Project_Task__c",
                  Where: [ "Project_Name__c  = '"+record.name+"'"]
              });

              var milestones = sf_query({
                  Select: [
                      {
                          "Asset_MRR__c": "cost",
                      },
                      {
                          "Name": "name",
                      },
                      {
                          "pse__Status__c": "status",
                      },
                  ],
                  From: "pse__Milestone__c",
                  Where: [ "Child_Project__c = '"+record.id+"'",
                         "AND Product_Class__c = 'Website'"]
              });

              var ret = yield [ {builder: b}, {writer: c}, {designer: d}, {dis: data}, tasks, milestones];
              for(var j = 0; j < 4; ++j) {
                  var feild = Object.keys(ret[j])[0];
                  if(ret[j][feild]) {
                    if(ret[j][feild][0].name) { query_res[i][feild].name = ret[j][feild][0].name; }
                    if(ret[j][feild][0].email) { query_res[i][feild].email = ret[j][feild][0].email; }
                  }
              }
              query_res[i].tasks = ret[4];
              query_res[i].milestones = ret[5];
              console.log("Ret value for " + record.name + " : ", ret);
            }

            console.log(query_res);
            return query_res;
          }));
        }
      };
  }

})();
