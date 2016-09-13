(function () {
    angular.module('castor.controllers')

    .controller('recordCreateStep', [
        '$scope',
        '$state',
        '$stateParams',
        'showMessage',
        'recordService',

        function (
          $scope,
          $state,
          $stateParams,
          showMessage,
          recordService
        ) {
             if($stateParams.dataTransition == null) {
                 $state.go('menu.rental.date');
             } else {
                 $scope.rental = $stateParams.dataTransition.rental;
                 $scope.record = {};
                 $scope.record.blanket = 0;

                 $scope.sendData = function ($event) {
                    $event.preventDefault();

                    recordService.store($scope.record, $scope.rental.id)
                    .then(function (record) {
                        showMessage.success('Datos registrados');
                        console.log(record);
                    })
                    .catch(function (err) {
                        if(err.status == 404) {
                            showMessage.error('Hospedaje no encontrado');
                        } else if(err.status == 400) {
                            showMessage.error(err.data.message)
                        }
                    })
                 }
             }
        }
    ])
   
   .controller('RecordEditStep', [
      '$scope',
      '$state',
      '$stateParams',
      'showMessage',
      'recordService',

      function (
        $scope,
        $state,
        $stateParams,
        showMessage,
        recordService
      ) {
           if($stateParams.dataTransition == null) {
              $state.go('/');
           } else {
              $scope.record = $stateParams.dataTransition.record;

              $scope.sendData = function ($event) {
                    $event.preventDefault();
      
                    recordService.update($scope.record)
                    .then(function (record) {
                        showMessage.success('Datos registrados');
                        console.log(record);
                    })
                    .catch(function (err) {
                        if(err.status == 404) {
                            showMessage.error('Hospedaje no encontrado');
                        } else if(err.status == 400) {
                            showMessage.error(err.data.message)
                        }
                    })
                 }
           }
      }
    ])
})()