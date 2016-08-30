(function () {
   angular.module('castor.controllers')

   .controller('reservationDateCreate', [
       '$scope',
       '$stateParams',
       'showMessage',
       'time',
       'extendRoomService',
       'rentalService',
       'clientService',

       function (
          $scope,
          $stateParams,
          showMessage,
          time,
          rentalService,
          clientService
       ) {
            $scope.loadingRoom = false;
            $scope.client = {};
            $scope.notFound = false;
            $scope.loading = false;

            $scope.rental = {
               identity_card: '',
               type: 'days'
            };

            $scope.availableDateReservationRoom = function ($event) {
                $event.preventDefault();

                $scope.rental.arrival_time = time.setTime($scope.rental.time);

                if(!time.validDateTime($scope.rental)) {
                    return;
                }

                $scope.rooms = [];
                $scope.rental.room_ids = [];

                rentalService.getAvailableDate(
                  time.filterDate($scope.rental.arrival_date),
                  time.filterDate($scope.rental.departure_date),
                  time.setTime($scope.rental.time)
                )
                .then(function(rooms) {
                    $scope.loadingRoom = true;
                    $scope.rooms = extendRoomService.extendRooms(rooms);

                })
                .catch(function (err) {
                    $scope.loadingRoom = true;
                    showMessage.error(err.data.message);
                })
            }

            if($stateParams.id != null) {
                clientService.getClient($stateParams.id)
                .then(function (client) {
                    $scope.loading = true;
                    $scope.client = client;
                })
                .catch(function (err) {
                    $scope.notFound = true;
                });
            } else {
                $scope.loading = true;
            }

       }
    ])

   .controller('reservationHourCreate', [
       '$scope',
       '$stateParams',
       'showMessage',
       'time',
       'extendRoomService',
       'rentalService',
       'settingService',
       'clientService',

       function (
          $scope,
          $stateParams,
          showMessage,
          time,
          extendRoomService,
          rentalService,
          settingService,
          clientService
       ) {
             $scope.loadingRoom = false;
             $scope.client = {};
             $scope.notFound = false;
             $scope.loading = false;

             $scope.rental = {
                identity_card: '',
                type: 'hours'
             };

             $scope.availableHourReservationRoom = function ($event) {
                $event.preventDefault();

                var currentTime = time.getHour();
                var endTime = time.getEndTime(
                   currentTime,
                   $scope.rental.time_close, 
                   $scope.setting.time_minimum
                );

                $scope.rental.arrival_date = time.filterDate($scope.rental.start_date);
                $scope.rental.arrival_time = time.setTime($scope.rental.time);

                if(!time.validDateTime($scope.rental)) {
                    return;
                }

                $scope.rooms = [];
                $scope.rental.room_ids = [];

                rentalService.getAvailableHour(
                    $scope.rental.arrival_date,
                    $scope.rental.arrival_time,
                    endTime
                )
                .then(function (rooms) {
                    $scope.loadingRoom = true;
                    $scope.rooms = extendRoomService.extendRooms(rooms);
                })
                .catch(function (err) {
                    $scope.loadingRoom = true;
                    showMessage.error(err.data.message);
                })
             }

             $scope.loadSetting = function () {
                settingService.getSetting()
                .then(function (setting) {
                    $scope.setting = setting;
                    $scope.loading = true;
                })
             }

             if($stateParams.id != null) {
                clientService.getClient($stateParams.id)
                .then(function (client) {
                    $scope.client = client;
                    $scope.loadSetting();

                })
                .catch(function (err) {
                    $scope.notFound = true;
                });
             } else {
                $scope.loadSetting();
             }

             $scope.addRoom = function (roomId) {
                $scope.rental.room_ids = extendRoomService.addRoom(
                    $scope.rooms,
                    $scope.rental.room_ids,
                    roomId
                );
               
            }

            $scope.detachRoom = function (roomId) {
                $scope.rental.room_ids = extendRoomService.detachRoom(
                    $scope.rooms,
                    $scope.rental.room_ids,
                    roomId
                )
            }

            $scope.sendReservation = function ($event) {
                $event.preventDefault();

                if($scope.client.id == undefined && $scope.rental.identity_card == '') {
                    showMessage.error('La cedula es obligatoria');

                    return false;
                }

               rentalService.storeReservation($scope.client.id, $scope.rental)
               .then(function (rental) {
                  console.log(rental.id);
                  showMessage.success('La reservacion ha sido registrada');
               })
               .catch(function (err) {
                  if(err.status == 404) {
                     showMessage.error('Cliente no registrado');
                  } else {
                     showMessage.error(err.data.message);
                  }
               })
            }

       }
    ])

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