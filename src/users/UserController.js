(function(){

  angular
       .module('users')
       .controller('UserController', [
          'userService', '$mdSidenav', '$mdBottomSheet', '$log', '$scope',
          UserController
       ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function UserController( userService, $mdSidenav, $mdBottomSheet, $log, $scope) {
    var self = this;

    self.selected     = null;
    self.users        = [ ];
    self.selectUser   = selectUser;
    self.toggleList   = toggleUsersList;
    self.share        = share;

    // Load all registered users

    co(function *() {
      var login = yield sf_login("jcardinal@dealersocket.com","!@!#!$15q!!", "JoWTE1qRQnh3cu9nQdfP8edGh");
      sf_c_user = yield sf_query({
          Select: [
              {
                  "Id" : "id"
              },
              {
                  "Name": "name"
              }
          ],
          From: "Contact",
          "Where" : [
              "Name = 'Jason Cardinal'"
          ]
      });

      console.log("Login successfull ", sf_c_user);
      console.log("Loading dealers...");

      $scope.toggleCompleteTask = function(task) {
        console.log("Clicked! ", task);

        co(function *() {
          task.pendingValue = true;
          var update = yield conn.sobject("pse__Project_Task__c").update({
            Id: task.id,
            pse__Status__c: (task.completed) ? "Complete" : "Incomplete"
          }, function(err, ret) {
            task.pendingValue = false;
            console.log(task);
            if(err || !ret.success) {
              task.completed = !task.completed;
              $scope.$apply();
              return console.error(err, ret);
            }
            $scope.$apply();
            return ret;
          });
          console.log(update);
        });
      }

      userService
            .loadAllDealers(sf_c_user[0].id)
            .then( function( users ) {
              self.users    = [].concat(users);
              self.selected = users[0];
            });
    }).catch(function(err) {
      console.error(err.stack);
    })


    // *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleUsersList() {
      $mdSidenav('left').toggle();
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectUser ( user ) {
      self.selected = angular.isNumber(user) ? $scope.users[user] : user;
      self.toggleList();
    }



    /**
     * Show the bottom sheet
     */
    function share($event) {
        var user = self.selected;

        $mdBottomSheet.show({
          parent: angular.element(document.getElementById('content')),
          templateUrl: './src/users/view/contactSheet.html',
          controller: [ '$mdBottomSheet', UserSheetController],
          controllerAs: "vm",
          bindToController : true,
          targetEvent: $event
        }).then(function(clickedItem) {
          $log.debug( clickedItem.name + ' clicked!');
        });

        /**
         * Bottom Sheet controller for the Avatar Actions
         */
        function UserSheetController( $mdBottomSheet ) {
          this.user = user;
          this.items = [
            { name: 'Phone'       , icon: 'phone'       , icon_url: 'assets/svg/phone.svg'},
            { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'assets/svg/twitter.svg'},
            { name: 'Google+'     , icon: 'google_plus' , icon_url: 'assets/svg/google_plus.svg'},
            { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'assets/svg/hangouts.svg'}
          ];
          this.performAction = function(action) {
            $mdBottomSheet.hide(action);
          };
        }
    }

  }

})();
