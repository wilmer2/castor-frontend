(function () {
     angular.module('castor.services')

     .factory('auditService', ['$http', '$q', 'Backend', 
        function ($http, $q, Backend) {
           function getAudit() {
             var deferred = $q.defer();
              
             $http.get(Backend.url + 'audits').then(function (res) {
                 deferred.resolve(res.data);
             }, function (err) {
                 deferred.reject(err);
             });

             return deferred.promise;
           }

           return {
             getAudit: getAudit
           }

        }
      ])
})()