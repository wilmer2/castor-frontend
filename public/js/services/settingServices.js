(function () {
    angular.module('castor.services')

    .factory('settingService', ['$http', '$q', 'Backend',
        function ($http, $q, Backend) {
            function getSetting() {
                var deferred = $q.defer();
                
                $http.get(Backend.url + 'setting').then(function (res) {
                    deferred.resolve(res.data);
                });

                return deferred.promise;
            }

            return {
              getSetting: getSetting
            }
        
    }])
})();