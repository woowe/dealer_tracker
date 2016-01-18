(function(){

  angular
       .module('users')
       .controller('UserController', [
          'userService', '$mdSidenav', '$mdBottomSheet', '$log',
          UserController
       ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function UserController( userService, $mdSidenav, $mdBottomSheet, $log ) {
    var self = this;

    self.selected     = null;
    self.users        = [ ];
    self.selectUser   = selectUser;
    self.toggleList   = toggleUsersList;
    self.share        = share;

    // Load all registered users

    co(function *() {
      var login = yield sf_login("jcardinal@dealersocket.com","!@!#!$15q!!", "JoWTE1qRQnh3cu9nQdfP8edGh");
      var user_info = yield sf_query("Select Id, Name FROM Contact WHERE Name = 'Jason Cardinal'");
      sf_c_user = user_info.records[0];

      var b = sf_query("Select Id, Name FROM Contact WHERE Name = 'Jason Cardinal'");
      var d = sf_query("Select Id, Name FROM Contact WHERE Name = 'Jason Cardinal'");
      var c = sf_query("Select Id, Name FROM Contact WHERE Name = 'Jason Cardinal'");
      var data = sf_query("Select Id, Name FROM Contact WHERE Name = 'Jason Cardinal'");

      var team = yield {
        builder: b,
        design: d,
        content: c,
        data: data
      };
      
      console.log("Login successfull ", sf_c_user);
      console.log("Loading dealers...");
      userService
            .loadAllDealers(sf_c_user.Id)
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
