(function () {
     angular.module('castor.controllers')

     .controller('moveController', [
        '$scope', 
        '$state',
        'time',
        'DTOptionsBuilder', 
        'moveService', 
        'settingService',

        function (
          $scope,
          $state,
          time,
          DTOptionsBuilder,
          moveService,
          settingService
        ) {   
             var currentDate = time.getDate();

             $scope.startDate = time.formatDate(currentDate);
             $scope.endDate = time.getDayAfter();
             $scope.moves = [];

             $scope.dtOptions = DTOptionsBuilder.newOptions()
             .withLanguage(settingService.getSettingTable())
             .withDOM('ftp')
             .withBootstrap()

             $scope.getMove = function () {
                moveService.getMoves(
                  time.filterDate($scope.startDate), 
                  time.filterDate($scope.endDate)
                )
                .then(function (moves) {
                   $scope.moves = moves;
                })
                .catch(function (err) {
                   console.log(err);
                })
             }
              
             $scope.getMove();
        }
      ])
})();