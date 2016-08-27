(function () {
    angular.module('castor.controllers')

    /*.controller('rentalCreate', [
        '$scope', 
        '$http', 
        '$stateParams',
        'showMessage', 
        'time', 
        'Backend', 
        'extendRoomService',
        'clientService',
        'rentalService',

        function (
          $scope, 
          $http, 
          $stateParams, 
          showMessage,
          time, 
          Backend, 
          extendRoomService, 
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
                    $scope.rooms = extendRoomService.extendRooms(rooms);
                })
                .catch(function (res) {
                    $scope.rental.room_ids = [];
                    $scope.rooms = [];

                    showMessage.error(res.data.message);
                });
            }

            if($stateParams.id != null) {
                clientService.getClient($stateParams.id)
                .then(function (client) {
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
    ])*/

    .controller('renovateDate', [
        '$scope', 
        '$stateParams', 
        'showMessage', 
        'time', 
        'extendRoomService',
        'rentalService',

        function (
          $scope,
          $stateParams,
          showMessage,
          time,
          extendRoomService,
          rentalService
        ) {
            $scope.notFound = false;
            $scope.loading = false;
            $scope.loadingRoom = false;

            rentalService.getEnabledRooms($stateParams.id)
            .then(function (data) {
                $scope.rental = rentalService.formatData(data.rental);
                $scope.currentRooms = extendRoomService.extendRooms(data.available_rooms);
                $scope.loading = true;
            })
            .catch(function (err) {
                $scope.notFound = true;
            });

            $scope.availableDateRooms = function ($event) {
               $event.preventDefault();

                if($scope.rental.departure_date == undefined) {
                    showMessage.error('Debe ingresar fecha de salida');

                    return false;
                }

                $scope.rooms = [];
                $scope.staticRooms = [];
                $scope.rental.room_ids = [];
                $scope.rental.static_rooms = [];
                $scope.maxRoom = 0;
                $scope.all = false;
                $scope.countRoom = 0;

                rentalService.getConfirmDateRooms(
                  $scope.rental.id,
                  $scope.rental.old_departure,
                  time.filterDate($scope.rental.departure_date),
                  $scope.rental.departure_time
                )
                .then(function (data) {
                    $scope.loadingRoom = true;
                    $scope.select = data.select;

                    $scope.loadRooms(data.rooms);  
                })
                .catch(function (err) {
                    showMessage.error(err.data.message);
                })
            }

            $scope.loadRooms = function (roomsAvailable) {
                var rooms = extendRoomService.extendRooms(roomsAvailable);

                $scope.rooms = extendRoomService.previouslySelectedRoom($scope.currentRooms, rooms);
                $scope.rental.room_ids = extendRoomService.addPreviouslySelectedRoom($scope.rooms, $scope.rental.room_ids);
                $scope.countRoom = $scope.rental.room_ids.length;
                $scope.maxRoom = extendRoomService.maxRoom($scope.currentRooms, $scope.rooms);

                if($scope.select) {
                    $scope.staticRooms = extendRoomService.getStaticRooms($scope.currentRooms, rooms);
                } else {
                    $scope.staticRooms = [];
                }

                $scope.countAll();
            }

            $scope.addRoom = function (roomId) {
                $scope.rental.room_ids = extendRoomService.addRoom(
                    $scope.rooms,
                    $scope.rental.room_ids,
                    roomId
                );
                
                $scope.countRoom ++;
                $scope.countAll();
            }

            $scope.detachRoom = function (roomId) {
                $scope.rental.room_ids = extendRoomService.detachRoom(
                    $scope.rooms,
                    $scope.rental.room_ids,
                    roomId
                )
                
                $scope.countRoom --;
                $scope.countAll();
            }

            $scope.addStaticRoom = function (roomId) {
                $scope.rental.static_rooms = extendRoomService.addRoom(
                    $scope.staticRooms,
                    $scope.rental.static_rooms,
                    roomId
                );
                
                $scope.countRoom ++;
                $scope.countAll();
            }

            $scope.detachStaticRoom = function (roomId) {
                $scope.rental.static_rooms = extendRoomService.detachRoom(
                    $scope.staticRooms,
                    $scope.rental.static_rooms,
                    roomId
                );
                 
                $scope.countRoom --;
                $scope.countAll();
            }

            $scope.countAll = function () {
                $scope.all = extendRoomService.countAllRoom(
                    $scope.rental.room_ids,
                    $scope.rental.static_rooms,
                    $scope.maxRoom
                );
            }

            $scope.sendRenovate = function ($event) {
                $event.preventDefault();

                rentalService.sendRenovateDate($scope.rental).then(function (data) {
                    $scope.rental = data;
                    showMessage.success('Renovacion registrada');
                })
                .catch(function (err) {
                    showMessage.error(err.data.message);
                });
            }

        }
     ])

})(_);