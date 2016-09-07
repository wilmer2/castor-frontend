(function () {
    angular.module('castor.controllers')

    .controller('clientShow', [
        '$scope',
        '$state', 
        '$stateParams', 
        'showMessage',
        'DTOptionsBuilder',
        'clientService',
        'settingService',

        function (
          $scope,
          $state, 
          $stateParams, 
          showMessage,
          DTOptionsBuilder,
          clientService, 
          settingService
        ) {

             $scope.loading = false;
             $scope.notFound = false;

             clientService.findClient($stateParams.id)
             .then(function (client) {
                $scope.loading = true;
                $scope.client = client;

                $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withLanguage(settingService.getSettingTable())
                .withDOM('ftp')
                .withBootstrap();
             })
             .catch(function (err) {
                $scope.loading = true;
                $scope.notFound = true;
             })

             $scope.delete = function () {
                clientService.deleteClient($scope.client.id)
                .then(function (res) {
                    showMessage.success(res.message);
                })
                .catch(function (err) {
                    if(err.status == 404) {
                        showMessage.error('Cliente no encontrado');
                    }
                })
             }

             $scope.confirmDelete = function () {
                var message = "Esta seguro de eliminar cliente";

                alertify.confirm(message, $scope.delete)
                .setting({
                  'title': 'Eliminar Cliente',
                  'labels': {
                    'ok': 'Confirmar',
                    'cancel': 'Cancelar'
                   }
                });
             }
        }
    ])

    .controller('clientCreate', ['$scope', 'showMessage', 'clientService',
        function ($scope, showMessage, clientService) {
           $scope.sendData = function ($event) {
              $event.preventDefault();

              clientService.store($scope.client)
              .then(function (client) {
                  console.log(client);
                  showMessage.success('Cliente ha sido registrado');
              })
              .catch(function (err) {
                  showMessage.error(err.data.message);
              })
           }
        }
    ])

    .controller('clientList', ['$scope', 'DTOptionsBuilder', 'clientService', 'settingService',
        function ($scope, DTOptionsBuilder, clientService, settingService) {
             $scope.clients = [];
             $scope.dtOptions = DTOptionsBuilder.newOptions()
             .withLanguage(settingService.getSettingTable())
             .withDOM('ftp')
             .withBootstrap()

             clientService.getClients()
             .then(function (clients) {
                 $scope.clients = clients;
             })
             .catch(function (err) {
                 console.log(err);
             });


        }
    ])
})(alertify)