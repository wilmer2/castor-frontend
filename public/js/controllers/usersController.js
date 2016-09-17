(function () {
     angular.module('castor.controllers')

     .controller('userCreate', ['$scope', '$state', 'showMessage', 'userService',
         function ($scope, $state, showMessage, userService) {
            $scope.sendData = function ($event) {
                $event.preventDefault();

                userService.store($scope.user)
                .then(function (user) {
                    showMessage.success('Usuario ha sido registrado');
                    $state.go('menu.user.list');
                })
                .catch(function (err) {
                    if(err.status == 400) {
                        showMessage.error(err.data.message);
                    } 
                })
            }
         }
      ])

     .controller('userEdit', [
        '$scope', 
        '$state', 
        '$stateParams', 
        'showMessage',
        'userService',

        function (
            $scope,
            $state,
            $stateParams,
            showMessage,
            userService
        ) {
             $scope.loading = false;
             $scope.notFound = false;

             userService.findUser($stateParams.id)
             .then(function (user) {
                $scope.loading = true;
                $scope.user = user;
             })
             .catch(function (err) {
                if(err.status == 404) {
                    $scope.loading = true;
                    $scope.notFound = true;
                }
             });

             $scope.sendData = function ($event) {
                $event.preventDefault();
                
                userService.update($scope.user)
                .then(function (user) {
                    showMessage.success('El usuario ha sido actualizado');
                    $state.go('menu.user.list');
                })
                .catch(function (err) {
                  if(err.status == 400) {
                      showMessage.error(err.data.message);
                  }
                })
             }

        }
    ])

    .controller('userList', [
        '$scope',
        '$state',
        'DTOptionsBuilder',
        'userService',
        'settingService',

        function (
            $scope,
            $state,
            DTOptionsBuilder,
            userService,
            settingService
        ) {
              $scope.users = [];
              $scope.dtOptions = DTOptionsBuilder.newOptions()
              .withLanguage(settingService.getSettingTable())
              .withDOM('ftp')
              .withBootstrap()

              userService.getUsers()
               .then(function (users) {
                  $scope.users = userService.loadRoles(users);
              })
              .catch(function (err) {
                  console.log(err);
              });

             $scope.edit = function (userId) {
                $state.go('menu.user.edit', {id: userId});
             }
        }
    ])
})();