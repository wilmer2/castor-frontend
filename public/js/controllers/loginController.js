(function () {
     angular.module('castor.controllers')

     .controller('login', ['$scope', '$http', '$state', 'showMessage', 'Backend', 
       function ($scope, $http, $state, showMessage, Backend) {
          $scope.login = function () {
            $http.post(Backend.url + 'login', {email: $scope.email, password: $scope.password})
            .then(function (res) {
                $state.go('menu');
            }, function (res) {
                showMessage.error(res.data.message);
            })
          }
       }])
})();