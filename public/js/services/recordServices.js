(function () {
    angular.module('castor.services')

    .factory('recordService', ['$http', '$q', 'Backend',
        function($http, $q, Backend) {
          function store(record, rentalId) {
              var deferred = $q.defer();

              $http.post(Backend.url + 'rentals/' + rentalId + '/records', record)
              .then(function (res) {
                  deferred.resolve(res.data);
              })
              .catch(function (err) {
                  deferred.reject(err);
              });

              return deferred.promise;
          }

          function update(record) {
              var deferred = $q.defer();

              $http.put(Backend.url + 'records/' + record.id, record)
              .then(function (res) {
                  deferred.resolve(res.data);
              })
              .catch(function (err) {
                  deferred.reject(err);
              });

              return deferred.promise;
          }

          return {
            store: store,
            update: update
          }
        }
    ])
})()