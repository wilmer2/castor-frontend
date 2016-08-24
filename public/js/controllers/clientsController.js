(function () {
    angular.module('castor.controllers')
    .controller('clientShow', ['$scope', '$http', '$stateParams', 'NgTableParams', 'clientService',
        function ($scope, $http, $stateParams, NgTableParams ,clientService) {
           $scope.loading = true;
           $scope.client = {};

           clientService.getClient($stateParams.id)
           .then(function (client) {
              $scope.loading = false;
              $scope.notFound = false;
              $scope.client = client;

              //$scope.tableParams = new NgTableParams({}, { dataset: client.rentals});
              
           })
           .catch(function (err) {
              $scope.loading = false;
              $scope.notFound = true;
           })
        }
    ])
})()