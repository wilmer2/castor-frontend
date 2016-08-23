(function () {
     angular.module('castor.services')

     .factory('clientService', ['$http', '$q', 'Backend', 
       function ($http, $q, Backend) {
          var deferred = $q.defer();

          function getClient (id) {
              $http.get(Backend.url + 'clients/' + id).then(function (res) {
                  deferred.resolve(res.data);
              }, function (err) {
                  deferred.reject(err);
              })

              return deferred.promise;
          }

          return {
            getClient: getClient
          }
       }])
})();