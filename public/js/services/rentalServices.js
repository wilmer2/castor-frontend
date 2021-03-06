(function () {
    angular.module('castor.services')

    .factory('rentalService', ['$http', '$q', 'time' ,'Backend',
        function ($http, $q, time, Backend) {

            function all() {
                var deferred = $q.defer();

                $http.get(Backend.url + 'rentals').then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

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

            function getAvailableDateAdd(arrivalDate, departureDate, arrivalTime) {
                var deferred = $q.defer();
                var location = 'rooms/available_date/add/' + arrivalDate + '/' + departureDate + '/' + arrivalTime;

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

            function store(clientId, data) {
                var deferred = $q.defer();
                var location = 'clients/' + clientId  + '/rentals';

                $http.post(Backend.url + location, data).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function deleteRental(rentalId) {
                var deferred = $q.defer();

                $http.delete(Backend.url + 'rentals/' + rentalId).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function storeReservation(clientId, data) {
                var deferred = $q.defer();
                var location = 'clients/' + clientId + '/reservations'
                
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
                });

                return deferred.promise;
            }

            function sendRenovateHour(rental) {
                var deferred = $q.defer();
                var location = 'rentals/' + rental.id + '/renovate_hour';

                $http.put(Backend.url + location, rental).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function checkout(rentalId) {
                var deferred = $q.defer();
                var location = 'rentals/' + rentalId + '/checkout';
                
                $http.post(Backend.url + location).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

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

            function deleteRoom(rentalId, roomId) {
                var deferred = $q.defer();
                var location = 'rentals/' + rentalId + '/room/' + roomId + '/remove';

                $http.post(Backend.url + location).then(function (res) {
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

            function confirmReservation(rentalId) {
                var deferred = $q.defer();
                var location = 'rentals/' + rentalId + '/confirm';

                $http.post(Backend.url + location).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function getReservations(startDate, endDate) {
                var deferred = $q.defer();
                var location = 'rentals/reservation/' + startDate + '/' + endDate;
                
                $http.get(Backend.url + location).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function getReservationsPending() {
                var deferred = $q.defer();

                $http.get(Backend.url + 'rentals/reservation/pending')
                .then(function (res) {
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
                  type: data.type,
                  room_ids: [],
                  checkout: data.checkout,
                  reservation: data.reservation
                };

                if(data.departure_date == null) {
                    dataFormat.old_departure = data.arrival_date;
                } else {
                    dataFormat.old_departure = data.departure_date;
                }

                return dataFormat;
            }

            function formatDataEdit(data) {
                var dataEdit = {
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
                  record: data.record
                };

                return dataEdit;
            }

            function formatHourDataEdit(data) {
                var dataHour = {
                  id: data.id,
                  start_date: time.formatDate(data.arrival_date),
                  time: time.formatTime(data.arrival_time),
                  room_ids: [],
                  state: data.state,
                  reservation: data.reservation,
                  type: data.type,
                  checkout: data.checkout,
                  record: data.record
                }

                return dataHour;
            }

            return {
              all: all,
              getRental: getRental,
              getAvailableDate: getAvailableDate,
              getAvailableDateAdd: getAvailableDateAdd,
              getAvailableHourAdd: getAvailableHourAdd,
              getAvailableHour: getAvailableHour,
              store: store,
              checkout: checkout,
              storeReservation: storeReservation,
              getReservations: getReservations,
              getEnabledRooms: getEnabledRooms,
              getConfirmDateRooms: getConfirmDateRooms,
              getConfirmHourRooms: getConfirmHourRooms,
              getReservationsPending: getReservationsPending,
              changeRoom: changeRoom,
              formatData: formatData,
              formatDataEdit: formatDataEdit,
              formatHourDataEdit: formatHourDataEdit,
              sendRenovateDate: sendRenovateDate,
              sendRenovateHour: sendRenovateHour,
              addRoomForDate: addRoomForDate,
              addRoomForHour: addRoomForHour,
              updateReservationDate: updateReservationDate,
              updateReservationHour: updateReservationHour,
              deleteRental: deleteRental,
              deleteRoom: deleteRoom,
              confirmReservation: confirmReservation
            }

        }
    ])
})();