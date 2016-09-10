(function () {
     angular.module('castor.services')

     .factory('roomService', ['$http', '$q', 'Backend',
        function ($http, $q, Backend)  {
            function store(room) {
                var deferred = $q.defer();

                $http.post(Backend.url + 'rooms', room)
                .then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function findRoom(roomId) {
                var deferred = $q.defer();

                $http.get(Backend.url + 'rooms/' + roomId)
                .then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function update(room) {
                var deferred = $q.defer();

                $http.put(Backend.url + 'rooms/' + room.id, room)
                .then(function (res) {
                     deferred.resolve(res.data);
                }, function (err) {
                     deferred.reject(err);
                });

                return deferred.promise;
            }

            function deleteRoom(roomId) {
                var deferred = $q.defer();

                $http.delete(Backend.url + 'rooms/' + roomId)
                .then(function (res) {
                     deferred.resolve(res.data);
                }, function (err) {
                     deferred.reject(err);
                });

                return deferred.promise;
            }

            function enableRoom(roomId) {
                var deferred = $q.defer();

                $http.post(Backend.url + 'rooms/' + roomId + '/enable').then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function disabledRoom(roomId) {
                var deferred = $q.defer();

                $http.post(Backend.url + 'rooms/' + roomId + '/disabled').then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function getRooms() {
                var deferred = $q.defer();

                $http.get(Backend.url + 'rooms').then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function getRoomMaintenace() {
                var deferred = $q.defer();
                
                $http.get(Backend.url + 'rooms/maintenance').then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function getRoomDisabled() {
                var deferred = $q.defer();

                $http.get(Backend.url + 'rooms/disabled').then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            return {
               store: store,
               findRoom: findRoom,
               update: update,
               deleteRoom: deleteRoom,
               enableRoom: enableRoom,
               disabledRoom: disabledRoom,
               getRooms: getRooms,
               getRoomMaintenace: getRoomMaintenace,
               getRoomDisabled: getRoomDisabled
            }
        }
      ])
})()