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
            var query_res = yield sf_query("SELECT Builder__c, Dealer_City_Location__c, Dealer_State_Location__c, Percent_Complete__c, Name, pse__Project_Status__c, pse__Project_Type__c, pse__Stage__c, Trans_Call_Date__c, Zip__c, Content_Writer__c, DIS__c, Website_Designer__c, Actual_Go_Live_Date1__c, Projected_Go_Live_Date__c, Planned_Go_Live_Date__c FROM pse__Proj__c WHERE pse__Stage__c = 'In Preparation' AND Builder__c = '" + id + "'");

            for(var i = 0; i < query_res.records.length; ++i) {
              var record = query_res.records[i];
              console.log(record.Builder__c + " ||| " + record.Content_Writer__c + " ||| " + record.Website_Designer__c + " ||| " + record.DIS__c);
              var b = null, d = null, c = null, data = null;
              if(record.Builder__c) {
                b = sf_query("Select Id, Name FROM Contact WHERE Id = '"+record.Builder__c+"'");
              }
              if(record.Content_Writer__c) {
                d = sf_query("Select Id, Name FROM Contact WHERE Id = '"+record.Content_Writer__c+"'");
              }
              if(record.Website_Designer__c) {
                c = sf_query("Select Id, Name FROM Contact WHERE Id = '"+record.Website_Designer__c+"'");
              }
              if(record.DIS__c) {
                data = sf_query("Select Id, Name FROM Contact WHERE Id = '"+record.DIS__c+"'");
              }

              var team = yield {
                builder: b,
                content: c,
                design: d,
                data: data
              };

              console.log("Gathered team for " + record.Name + " : ", team);

              query_res.records[i].team = team;
            }

            console.log(query_res);
            return query_res.records;
          }));
        }
      };
  }

})();
