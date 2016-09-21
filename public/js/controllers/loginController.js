(function () {
     angular.module('castor.controllers')

     .controller('login', [
       '$scope',  
       '$state', 
       '$rootScope',
       'showMessage', 
       'authService',

       function (
         $scope,
         $state, 
         $rootScope,
         showMessage, 
         authService
       ) {   
            $scope.loading = false;
            $scope.credentials = {};
            authService.cleanUser(); 

            $scope.redirectUser = function (user) {
              if(user.role == 1 || user.role == 3) {
                 $state.go('menu.user.list');
              } else {
                 $state.go('menu.rental.list');
              }
            }

            authService.getUser()
            .then(function (user) {
               $scope.redirectUser(user);
            })
            .catch(function (err) {
               authService.cleanUser();
               $scope.loading = true;
            })
            

            $scope.login = function ($event) {
              $event.preventDefault();
              authService.login($scope.credentials)
              .then(function (user) {
                 $scope.redirectUser(user);
              })
              .catch(function (err) {
                showMessage.error(err.data.message);
              })
            }
      }])

     .controller('auth', [
       '$scope',
       '$state',
       '$rootScope',  
       'authService',

        function (
          $scope, 
          $state, 
          $rootScope,
          authService
        ) {
            $scope.$watch( $rootScope.loggedIn, function () {
               authService.getUser().then(function (user) {
                    $scope.currentUser = user;
                })
            });

            $scope.logout = function ($event) {
               $event.preventDefault();

               authService.logout()
               .then(function () {
                  authService.cleanUser();
                  $state.go('login');
               })
            }
        }
      ])
})();