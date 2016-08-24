(function () {
    angular.module('castor.controllers')

    .controller('rentalCreate', [
        '$scope', 
        '$http', 
        '$stateParams',
        'showMessage', 
        'time', 
        'Backend', 
        'extendRooms',
        'clientService',
        'rentalService',

        function (
          $scope, 
          $http, 
          $stateParams, 
          showMessage,
          time, 
          Backend, 
          extendRooms, 
          clientService,
          rentalService
        ) {
            
            $scope.client = {};
            $scope.notFound = false;

            $scope.rental = {
                departure_date: time.getDayAfter(),
                type: 'days',
                room_ids: []
            };

              $scope.searchRooms = function () {
                var arrivalDate = time.getDate();
                var arrivalTime = time.getHour();
                var departureDate = time.filterDate($scope.rental.departure_date);

                rentalService.getAvailableDate(arrivalDate, departureDate, arrivalTime)
                .then(function (rooms) {
                    $scope.rental.room_ids = [];
                    $scope.rooms = extendRooms.extendSelectRooms(rooms);
                })
                .catch(function (res) {
                    showMessage.error(res.data.message);
                });
            }

            if($stateParams.id != null) {
                clientService.getClient($stateParams.id).then(function (client) {
                    $scope.client = client;

                    $scope.searchRooms();
                })
                .catch(function (err) {
                    $scope.notFound = true;
                })
            } else {
                $scope.searchRooms();
            }

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

                rentalService.store($stateParams.id, $scope.rental)
                .then(function (rental) {
                    showMessage.success('Hospedaje registrado');
                    console.log(rental);
                })
                .catch(function (err) {
                    if(err.status == 404) {
                        showMessage.error('client no  registrado');
                    } else {
                        showMessage.error(err.data.message);
                    }
                })
            }
        }
    ])
})(_);