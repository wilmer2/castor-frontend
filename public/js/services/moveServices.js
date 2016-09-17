(function () {
     angular.module('castor.services')

     .factory('moveService', ['$http', '$q', 'Backend',
        function ($http, $q, Backend) {
          function getMoves(startDate, endDate) {
             var deferred = $q.defer();
             var location = 'moves/' + startDate + '/' + endDate;   

             $http.get(Backend.url + location).then(function (res) {
                 deferred.resolve(res.data);
             }, function (err) {
                 deferred.reject(err);
             });

             return deferred.promise;
          }

          return {
            getMoves: getMoves
          }
        }
      ])

    


})();