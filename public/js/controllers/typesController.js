(function () {
   angular.module('castor.controllers')

   .controller('TypeCreate', ['$scope', '$http', 'showMessage', 'Backend',
      function ($scope, $http , showMessage, Backend) {
         $scope.type = {
            file: '',
            mime: ''
         }

         $scope.typeStore = function ($event) {
            $event.preventDefault();

            $http.post(Backend.url + 'types', $scope.type).then(function (res) {
                showMessage.success('El tipo de habitacion ha sido registrado');
            }, function (res) {
                showMessage.error(res.data.message);
            })
      };
   
   }])

})();


