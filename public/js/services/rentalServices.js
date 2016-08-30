(function () {
    angular.module('castor.services')

    .factory('rentalService', ['$http', '$q', 'time' ,'Backend',
        function ($http, $q, time, Backend) {

            function getRental(id) {
                var deferred = $q.defer();
                var location = 'rentals/' + id;

                $http.get(Backend.url + location).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

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

            function getAvailableHour(arrivalDate, arrivalTime, departureTime) {
                var deferred = $q.defer();
                var location = 'rooms/available_hour/' + arrivalDate + '/' + arrivalTime + '/' + departureTime;

                $http.get(Backend.url + location).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });
                
                return deferred.promise;
            }

            function getAvailableHourAdd(arrivalDate, arrivalTime, departureTime) {
                var deferred = $q.defer();
                var location = 'rooms/available_hour/add/'  + arrivalDate + '/' + arrivalTime + '/' + departureTime;
                
                $http.get(Backend.url + location).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function hasClient(clientId, route) {
                if(clientId != null && clientId != undefined) {
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

            function storeReservation(clientId, data) {
                var deferred = $q.defer();
                var location = hasClient(clientId, 'rentals/reservation');
                
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

            function getConfirmHourRooms(id, startDate, startTime, endTime) {
                var deferred = $q.defer();
                var location = 'rentals/' + id + '/rooms_hour/' + startDate + '/' + startTime + '/' + endTime;
                
                $http.get(Backend.url + location).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function addRoomForDate(rental) {
                var deferred = $q.defer();
                var location = 'rentals/' + rental.id + '/add_rooms/date';

                $http.post(Backend.url + location, rental).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });
                
                return deferred.promise;
            }

            function addRoomForHour(rental) {
                var deferred = $q.defer();
                var location = 'rentals/' + rental.id + '/add_rooms/hour';
                
                $http.post(Backend.url + location, rental).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function changeRoom(rental, roomId) {
                var deferred = $q.defer();
                var location = 'rentals/' + rental.id + '/room/' + roomId + '/change';
                
                $http.post(Backend.url + location, rental).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                })

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

            function sendRenovateHour(rental) {
                var deferred = $q.defer();
                var location = 'rentals/' + rental.id + '/renovate_hour';

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
                });

                return deferred.promise;
            }

            function updateReservationHour(rental) {
                var deferred = $q.defer();
                var location = 'rentals/' + rental.id + '/reservation_hour';
              
                $http.put(Backend.url + location, rental).then(function (res) {
                   deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function formatData(data) {
                var dataFormat = {
                  id: data.id,
                  arrival_date: data.arrival_date,
                  arrival_time: data.arrival_time,
                  departure_time: data.departure_time,
                  static_rooms: [],
                  room_ids: [],
                  checkout: data.checkout
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
                  departure_time: data.departure_time,
                  room_ids: [],
                  state: data.state,
                  reservation: data.reservation,
                  type: data.type,
                  checkout: data.checkout,
                  available_change: data.available_change
                };

                return dataFormatEdit;
            }

            function formatHourDataEdit(data) {
                var dateHourFormat = {
                  id: data.id,
                  start_date: time.formatDate(data.arrival_date),
                  time: time.formatTime(data.arrival_time),
                  time_close: time.formatTime(data.departure_time),
                  room_ids: [],
                  state: data.state,
                  reservation: data.reservation,
                  type: data.type,
                  checkout: data.checkout,
                  availableChange: data.availableChange
                }

                return dateHourFormat;
            }

            return {
              getRental: getRental,
              getAvailableDate: getAvailableDate,
              getAvailableHourAdd: getAvailableHourAdd,
              getAvailableHour: getAvailableHour,
              store: store,
              storeReservation: storeReservation,
              getEnabledRooms: getEnabledRooms,
              getConfirmDateRooms: getConfirmDateRooms,
              getConfirmHourRooms: getConfirmHourRooms,
              changeRoom: changeRoom,
              formatData: formatData,
              formatDataEdit: formatDataEdit,
              formatHourDataEdit: formatHourDataEdit,
              sendRenovateDate: sendRenovateDate,
              sendRenovateHour: sendRenovateHour,
              addRoomForDate: addRoomForDate,
              addRoomForHour: addRoomForHour,
              updateReservationDate: updateReservationDate,
              updateReservationHour: updateReservationHour
            }

        }
    ])
})();