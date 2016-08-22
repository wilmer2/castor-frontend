(function () {
    angular.module('castor.controllers')

    .controller('rentalCreate', ['$scope', '$http', 'showMessage', 'time', 'Backend', 
        'clientProfile', 'extendRooms', function (
            $scope, $http, showMessage, time, Backend, clientProfile, extendRooms) {

            $scope.client = clientProfile.get();

            $scope.rental = {
                departure_date: time.getDayAfter(),
                type: 'days',
                room_ids: []
            };

            $scope.rooms = [];

            $scope.searchRooms = function () {
                var arrivalDate = time.getDate();
                var arrivalTime = time.getHour();
                var departureDate = time.filterDate($scope.rental.departure_date);
                var location = 'rooms/available_date/' + arrivalDate + '/' + departureDate + '/' + arrivalTime;

                $http.get(Backend.url + location).then(function (res) {
                    $scope.rental.room_ids = [];
                    $scope.rooms = extendRooms.extendSelectRooms(res.data);
                }, function (res) {
                    $scope.rooms = [];
                    showMessage.error(res.data.message);
                })
            }

            $scope.searchRooms();

            $scope.addRoom = function (roomId) {
                var room = _.find($scope.rooms, function (room) {
                      return room.roomId == roomId
                });

                $scope.rental.room_ids.push(roomId);
                room.select = true;
            }

            $scope.detachRoom = function (roomId) {
                var room = _.find($scope.rooms, function (room) {
                      return room.roomId == roomId
                });

               var roomIds = _.filter($scope.rental.room_ids, function (oldRoomId) {
                  return oldRoomId != roomId;
               });

               $scope.rental.room_ids = roomIds;

               room.select = false;
            }

            $scope.sendData = function ($event) {
                $event.preventDefault();

                $http.post(Backend.url + 'rentals', $scope.rental).then(function (res) {
                    console.log(res.data);
                    showMessage.success('El hospedaje ha sido registrado');
                }, function (res) {
                    if(res.status == 404) {
                        showMessage.error('cliente no registrado');
                    } else {
                        showMessage.error(res.data.message);
                    }
                })
            }

        }
    ])
})(_);