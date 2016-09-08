(function () {
    angular.module('castor.services')

    .factory('typeService', ['$http', '$q', 'Backend',
       function ($http, $q, Backend) {
         function store(type) {
             var deferred = $q.defer();

             $http.post(Backend.url + 'types', type).then(function (res) {
                 deferred.resolve(res.data);
             }, function (err) {
                 deferred.reject(err);
             })
             
             return deferred.promise;
         }

         function findType(typeId) {
             var deferred = $q.defer();

             $http.get(Backend.url + 'types/' + typeId).then(function (res) {
                  deferred.resolve(res.data);
             }, function (err) {
                  deferred.reject(err)
             });

             return deferred.promise;
         }

         function update(type) {
             var deferred = $q.defer();

             $http.put(Backend.url + 'types/' + type.id, type).then(function (res) {
                  deferred.resolve(res.data);
             }, function (err) {
                  deferred.reject(err);
             });

             return deferred.promise;
         }

         function getTypes() {
            var deferred = $q.defer();

            $http.get(Backend.url + 'types').then(function (res) {
                 deferred.resolve(res.data);
            }, function (err) {
                 deferred.reject(err);
            });

            return deferred.promise;
         }

         function deleteType(typeId) {
            var deferred = $q.defer();

            $http.delete(Backend.url + 'types/' + typeId).then(function (res) {
                deferred.resolve(res.data);
            }, function (err) {
                 deferred.reject(err);
            })

            return deferred.promise;
         }

         return {
            store: store,
            update: update,
            findType: findType,
            getTypes: getTypes,
            deleteType: deleteType
         }
    }])
})();