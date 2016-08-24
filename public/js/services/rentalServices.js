(function () {
    angular.module('castor.services')

    .factory('rentalService', ['$http', '$q', 'Backend',
        function ($http, $q, Backend) {
            function getAvailableDate(arrivalDate, departureDate, arrivalTime) {
               var deferred = $q.defer();
               var location = 'rooms/available_date/' + arrivalDate + '/' + departureDate + '/' + arrivalTime;

               $http.get(Backend.url + location).then(function (res) {
                   deferred.resolve(res.data);
               }, function (err) {
                   deferred.reject(err);
               });

               return deferred.promise;
            }

            function hasClient(clientId, route) {
                if(clientId != null) {
                    route += '?clientId=' + clientId;
                }

                return route;
            }

            function store(clientId, data) {
                var deferred = $q.defer();
                var location = hasClient(clientId, 'rentals');

                $http.post(Backend.url + location, data).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            return {
              getAvailableDate: getAvailableDate,
              store: store
            }

        }
    ])
})();