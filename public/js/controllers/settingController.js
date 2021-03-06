(function () {
    angular.module('castor.controllers')

    .controller('setting', [
       '$scope',
       '$rootScope',
       'showMessage',
       'time',
       'settingService',

       function (
         $scope,
         $rootScope,
         showMessage,
         time,
         settingService
       ) {  
            $scope.formatTime = function () {
               var formatTime =  time.formatTime($scope.setting.time_minimum);

               $scope.setting.time = formatTime;
            }

            settingService.getSetting()
            .then(function (setting) {
                $scope.setting = setting;
                $scope.formatTime();
            });

            $scope.sendData = function ($event) {
                $event.preventDefault();

                settingService.update($scope.setting)
                .then(function (setting) {
                   showMessage.success('Configuraciones actualizadas');
                   $scope.setting = setting
                   $rootScope.companyName = setting.name;

                   $scope.formatTime();
                })
                .catch(function (err) {
                   if(err.status == 400) {
                      showMessage.error(err.data.message);
                   }
                })
            }

       }
    ])
})()