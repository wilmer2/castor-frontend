(function () {
    angular.module('castor.services')

    .factory('rentalService', ['$http', '$q', 'time' ,'Backend',
        function ($http, $q, time, Backend) {
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

            function getEnabledRooms(id) {
                var deferred = $q.defer();
                var location = 'rentals/' + id + '/enabled_rooms';

                $http.get(Backend.url + location).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function getConfirmDateRooms(id, startDate, endDate, time) {
                var deferred = $q.defer();
                var location = 'rentals/' + id + '/rooms_date/' + startDate + '/' + endDate + '/' + time;

                $http.get(Backend.url + location).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function sendRenovateDate(rental) {
                var deferred = $q.defer();
                var location = 'rentals/' + rental.id + '/renovate_date';

                $http.put(Backend.url + location, rental).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                })

                return deferred.promise;
            }

            function updateReservationDate(rental) {
                var deferred = $q.defer();
                var location = 'rentals/' + rental.id + '/reservation_date';

                $http.put(Backend.url + location, rental).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                })

                return deferred.promise;
            }

            function formatData(data) {
                var dataFormat = {
                  id: data.id,
                  arrival_date: data.arrival_date,
                  arrival_time: data.arrival_time,
                  departure_time: data.departure_time,
                  static_rooms: [],
                  room_ids: []
                };

                if(data.departure_date == null) {
                    dataFormat.old_departure = data.arrival_date;
                } else {
                    dataFormat.old_departure = data.departure_date;
                }

                return dataFormat;
            }

            function formatDataEdit(data) {
                var dataFormatEdit = {
                  id: data.id,
                  arrival_date: time.formatDate(data.arrival_date),
                  departure_date: time.formatDate(data.departure_date),
                  time: time.formatTime(data.arrival_time),
                  room_ids: [],
                  reservation: data.reservation,
                  type: data.type
                };

                return dataFormatEdit;
            }

            return {
              getAvailableDate: getAvailableDate,
              store: store,
              getEnabledRooms: getEnabledRooms,
              getConfirmDateRooms: getConfirmDateRooms,
              formatData: formatData,
              sendRenovateDate: sendRenovateDate,
              formatDataEdit: formatDataEdit,
              updateReservationDate: updateReservationDate
            }

        }
    ])
})();