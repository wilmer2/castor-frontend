(function () {
    angular.module('castor.controllers')
    .controller('clientShow', ['$scope', '$http', '$stateParams', 'clientService',
        function ($scope, $http, $stateParams, clientService) {
           $scope.loading = true;

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
    ])
})()