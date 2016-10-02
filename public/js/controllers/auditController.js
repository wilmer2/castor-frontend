(function () {
     angular.module('castor.controllers')

     .controller('auditList', [
        '$scope', 
        '$state',
        'DTOptionsBuilder', 
        'auditService', 
        'settingService',

        function (
          $scope,
          $state,
          DTOptionsBuilder,
          auditService,
          settingService
        ) {
            $scope.loading = false;

            $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withLanguage(settingService.getSettingTable())
            .withDOM('tp')
            .withBootstrap()

            auditService.getAudit()
            .then(function (audits) {
                $scope.loading = true;
                $scope.audits = audits;
            })
            .catch(function (err) {
                if(err.status == 401 || err.status == 403) {
                    $state.go('login'); 
                }
            })
        }
      ])
})()