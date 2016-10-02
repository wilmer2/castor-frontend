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
       'settingService',
       'clientService',

        function (
          $scope, 
          $state, 
          $rootScope,
          authService,
          settingService,
          clientService
        ) {
            $scope.$watch($rootScope.loggedIn, function () {
               authService.getUser().then(function (user) {
                  $scope.currentUser = user;
                    
                  return settingService.getSetting();
                })
               .then(function (setting) {
                  $rootScope.companyName = setting.name;
               })

            });

            $scope.q = {};

            $scope.searchClients = function () { 
              if($scope.q.name.replace(/ /g,'') != '') {
                clientService.search($scope.q)
                .then(function (clients) {
                  $scope.clients = clients;
                })
                .catch(function (err) {
                   if(err.status == 401) {
                     $state.go('login');
                   } 
                })
              } else {
                 $scope.empty();
              }            
               
            }

            $scope.show = function (id) {
              $scope.q.name = '';
              $scope.empty();
              $state.go('menu.client.show', {id: id});
            }

            $scope.empty = function () {
               $scope.clients = [];
            }

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