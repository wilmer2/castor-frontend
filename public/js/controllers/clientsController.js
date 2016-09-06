(function () {
    angular.module('castor.controllers')

    /*.controller('clientShow', ['$scope', '$http', '$stateParams', 'NgTableParams', 'clientService',
        function ($scope, $http, $stateParams, NgTableParams ,clientService) {
           $scope.loading = true;
           $scope.client = {};

           clientService.getClient($stateParams.id)
           .then(function (client) {
              $scope.loading = false;
              $scope.notFound = false;
              $scope.client = client;
              
           })
           .catch(function (err) {
              $scope.loading = false;
              $scope.notFound = true;
           })
        }
    ])*/

    .controller('clientList', [
        '$scope', 
        'clientService', 
        'DTOptionsBuilder', 
        'DTColumnBuilder',
        'DTColumnDefBuilder',
        'clientService',

        function (
           $scope, 
           clientService, 
           DTOptionsBuilder, 
           DTColumnBuilder,
           DTColumnDefBuilder, 
           clientService
        ) {
             clientService.getClients()
             .then(function (clients) {
                 $scope.clients = clients;
                 $scope.dtOptions = DTOptionsBuilder.newOptions().withBootstrap()
                  .withLanguage({
                     "sEmptyTable":     "No data available in table",
                     "sInfo":           "Showing _START_ to _END_ of _TOTAL_ entries",
                     "sInfoEmpty":      "Showing 0 to 0 of 0 entries",
                     "sInfoFiltered":   "(filtered from _MAX_ total entries)",
                     "sInfoPostFix":    "",
                     "sInfoThousands":  ",",
                     "sLengthMenu":     "Show _MENU_ entries",
                     "sLoadingRecords": "Cargando...",
                     "sProcessing":     "Procesando...",
                     "sSearch":         "Buscar:",
                     "sZeroRecords":    "No matching records found",
                     "oPaginate": {
                         "sFirst":    "First",
                         "sLast":     "Last",
                         "sNext":     "Siguiente",
                         "sPrevious": "Atras"
                     },
                     "oAria": {
                         "sSortAscending":  ": activate to sort column ascending",
                         "sSortDescending": ": activate to sort column descending"
                     }         
               })
               .withDOM('ftp')
             })
             .catch(function (err) {
                 console.log(err);
             });


        }
    ])
})()