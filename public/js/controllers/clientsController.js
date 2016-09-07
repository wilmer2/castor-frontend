(function () {
    angular.module('castor.controllers')

    .controller('clientShow', [
        '$scope',
        '$state', 
        '$stateParams', 
        'showMessage',
        'clientService',

        function ($scope, $state, $stateParams, showMessage,clientService) {
           $scope.loading = false;
           $scope.notFound = false;

           clientService.findClient($stateParams.id)
           .then(function (client) {
              $scope.loading = true;
              $scope.client = client;
           })
           .catch(function (err) {
              $scope.loading = true;
              $scope.notFound = true;
           })

           $scope.edit = function () {
               $state.go('menu.client.edit', {id: $scope.client.id});
           }

           $scope.delete = function () {
              clientService.deleteClient($scope.client.id)
              .then(function (res) {
                 showMessage.success(res.message);
                 $state.go('menu.client.list');
              })
              .catch(function (err) {
                 if(err.status == 404) {
                    showMessage.error('Cliente no encontrado');
                    $state.go('menu.client.list');

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

    .controller('clientEdit', [
        '$scope', 
        '$state', 
        '$stateParams', 
        'showMessage', 
        'clientService',

        function ($scope, $state, $stateParams,  showMessage, clientService) {
           $scope.loading = false;
           $scope.notFound = false;

           clientService.findClient($stateParams.id)
           .then(function (client) {
              $scope.loading = true;
              $scope.client = client;
           })
           .catch(function (err) {
              $scope.loading = true;
              $scope.notFound = true;
           })

           $scope.updateClient = function () {
              clientService.update($scope.client)
              .then(function (client) {
                  $state.go('menu.client.show', {id: client.id})
                  showMessage.success('El cliente ha sido actualizado');
              })
              .catch(function (err) {
                  showMessage.error(err.data.message);
              })
           }
        }
    ])

    .controller('clientCreate', ['$scope', '$state', 'showMessage', 'clientService',
        function ($scope, $state, showMessage, clientService) {
           $scope.sendData = function ($event) {
              $event.preventDefault();

              clientService.store($scope.client)
              .then(function (client) {
                  showMessage.success('Cliente ha sido registrado');
                  state.go('menu.client.show', {id: client.id});
              })
              .catch(function (err) {
                  showMessage.error(err.data.message);
              })
           }
        }
    ])

    .controller('clientList', [
        '$scope', 
        '$state',
        'DTOptionsBuilder', 
        'clientService', 
        'settingService',

        function ($scope, $state, DTOptionsBuilder, clientService, settingService) {
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

             $scope.show = function (clientId) {
                $state.go('menu.client.show', {id: clientId});
             }

        }
    ])

    .controller('clientRentals', [
        '$scope', 
        '$state',
        '$stateParams',
        'DTOptionsBuilder', 
        'clientService', 
        'settingService',

        function (
          $scope, 
          $state, 
          $stateParams, 
          DTOptionsBuilder, 
          clientService, 
          settingService
        ) {  
             $scope.notFound = false;
             $scope.loading = false;
             $scope.rentals = [];

             $scope.dtOptions = DTOptionsBuilder.newOptions()
              .withLanguage(settingService.getSettingTable())
              .withDOM('ftp')
              .withBootstrap();

             clientService.getRentals($stateParams.id)
             .then(function (rentals) {
                $scope.rentals = rentals;
                $scope.loading = true;

             })
             .catch(function (err) {
                if(err.status == 404) {
                    $scope.notFound = true;
                    $scope.loading = true;
                }
             })
        }
    ])


})(alertify)