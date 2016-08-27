(function () {
   angular.module('castor.controllers')

   .controller('reservationDateEdit',  [
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
            $scope.loadingRoom = false;
            $scope.loading = false;

             rentalService.getEnabledRooms($stateParams.id)
            .then(function (data) {
                $scope.loading = true;
                $scope.rental = rentalService.formatDataEdit(data.rental);
                $scope.currentRooms = extendRoomService.extendRooms(data.available_rooms);
            })
            .catch(function (err) {
                $scope.notFound = true;
            });

            $scope.availableDateReservationRoom = function ($event) {
                $event.preventDefault();

                $scope.rooms = [];
                $scope.rental.room_ids = [];
                $scope.maxRoom = 0;
                $scope.all = false;
                $scope.countRoom = 0;
                $scope.loadingRoom = false;

                rentalService.getConfirmDateRooms(
                  $scope.rental.id,
                  time.filterDate($scope.rental.arrival_date),
                  time.filterDate($scope.rental.departure_date),
                  time.setTime($scope.rental.time)
                )
                .then(function(data) {
                    $scope.loadingRoom = true;
                    $scope.select = data.select;

                    $scope.loadRooms(data.rooms);

                })
                .catch(function (err) {
                    $scope.loadingRoom = true;
                    showMessage.error(err.data.message);
                })
            }

            $scope.loadRooms = function (roomsAvailable) {
                var rooms = extendRoomService.extendRooms(roomsAvailable);

                $scope.rooms = extendRoomService.previouslySelectedRoom($scope.currentRooms, rooms);
                $scope.rental.room_ids = extendRoomService.addPreviouslySelectedRoom($scope.rooms, $scope.rental.room_ids);
                $scope.countRoom = $scope.rental.room_ids.length;
                $scope.maxRoom = extendRoomService.maxRoom($scope.currentRooms, $scope.rooms);

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

            $scope.countAll = function () {
                $scope.all = $scope.rental.room_ids.length == $scope.maxRoom;
            }

            $scope.updateReservationDate = function () {

                $scope.rental.arrival_time = time.setTime($scope.rental.time);

                rentalService.updateReservationDate($scope.rental)
                .then(function (rental) {
                    console.log(rental.id);
                    showMessage.success('Renovacion actualizada');
                })
                .catch(function (err) {
                    showMessage.error(err.data.message);
                })
            } 
       }
    ])

    .controller('reservationHourEdit', [
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
            $scope.loadingRoom = false;
            $scope.loading = false;

            rentalService.getEnabledRooms($stateParams.id)
            .then(function (data) {
                $scope.loading = true;
                $scope.rental = rentalService.formatHourDataEdit(data.rental);
                $scope.currentRooms = extendRoomService.extendRooms(data.available_rooms);
            })
            .catch(function (err) {
                $scope.notFound = true;
            });

            $scope.availableHourReservationRoom = function ($event) {
                $event.preventDefault();

                $scope.rooms = [];
                $scope.rental.room_ids = [];
                $scope.maxRoom = 0;
                $scope.all = false;
                $scope.countRoom = 0;
                $scope.loadingRoom = false;

                rentalService.getConfirmHourRooms(
                  $scope.rental.id,
                  time.filterDate($scope.rental.start_date),
                  time.setTime($scope.rental.time),
                  time.setTime($scope.rental.time_close)
                )
                .then(function (data) {
                    $scope.loadingRoom = true;
                    $scope.select = data.select;

                    $scope.loadRooms(data.rooms);

                })
                .catch(function (err) {
                    showMessage.err(err.data.message);
                })
            }

            $scope.loadRooms = function (roomsAvailable) {
                var rooms = extendRoomService.extendRooms(roomsAvailable);

                $scope.rooms = extendRoomService.previouslySelectedRoom($scope.currentRooms, rooms);
                $scope.rental.room_ids = extendRoomService.addPreviouslySelectedRoom($scope.rooms, $scope.rental.room_ids);
                $scope.countRoom = $scope.rental.room_ids.length;
                $scope.maxRoom = extendRoomService.maxRoom($scope.currentRooms, $scope.rooms);

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

            $scope.countAll = function () {
                $scope.all = $scope.rental.room_ids.length == $scope.maxRoom;
            }

            $scope.updateReservationHour = function ($event) {
                $event.preventDefault();
                
                $scope.rental.arrival_date = time.filterDate($scope.rental.start_date);
                $scope.rental.arrival_time = time.setTime($scope.rental.time);
                $scope.rental.departure_time = time.setTime($scope.rental.time_close);

                rentalService.updateReservationHour($scope.rental)
                .then(function (rental) {
                    console.log(rental.id);
                    showMessage.success('Reservacion actualizada');
                })
                .catch(function (err) {
                    showMessage.error(err);
                })
            }
        }
    ])
})()