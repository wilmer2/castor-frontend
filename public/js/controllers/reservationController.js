(function () {
   angular.module('castor.controllers')

   .controller('reservationDateCreate', [
       '$scope',
       '$state',
       'showMessage',
       'time',
       'extendRoomService',
       'rentalService',
       'clientService',

       function (
          $scope,
          $state,
          showMessage,
          time,
          extendRoomService,
          rentalService,
          clientService
       ) {
            $scope.client = {};

            $scope.availableDateReservationRoom = function () {
                $scope.arrival_time = time.setTime($scope.time);

                $scope.rooms = [];

                rentalService.getAvailableDate(
                  time.filterDate($scope.arrival_date),
                  time.filterDate($scope.departure_date),
                  $scope.arrival_time
                )
                .then(function(rooms) {
                    $scope.rooms = extendRoomService.extendRooms(rooms);
                    
                    $state.go('menu.rental.room_reservation_date', {dataTransition: {
                        arrival_time: $scope.arrival_time,
                        arrival_date: $scope.arrival_date,
                        departure_date: $scope.departure_date,
                        state: $scope.state,
                        rooms: $scope.rooms,
                        client: $scope.client
                    }})

                })
                .catch(function (err) {
                    if(err.status == 401) {
                        $state.go('login');
                    } else if(err.status == 400) {
                        showMessage.error(err.data.message);
                    }
                })
            }

            $scope.searchClient = function () {
               clientService.findByIdentityCard($scope.identity_card)
               .then(function (client) {
                   $scope.client = client;
                   $scope.availableDateReservationRoom();
                })
                .catch(function (err) {
                   if(err.status == 401) {
                        $state.go('login');
                    } else if(err.status == 404) {
                        showMessage.error('No existe cliente con esta cedula');
                    }
                })
            }

            $scope.sendData = function ($event) {
                $event.preventDefault();

                if($scope.client.id == undefined ) {
                    $scope.searchClient();
                } else {
                    $scope.availableDateReservationRoom();
                }
            }

       }
    ])

    .controller('reservationDateRoom', [
        '$scope',
        '$state',
        '$stateParams',
        'showMessage',
        'extendRoomService',
        'rentalService',

        function (
          $scope,
          $state,
          $stateParams,
          showMessage,
          extendRoomService,
          rentalService
        ) {  
             if($stateParams.dataTransition == null) {
                 $state.go('menu.rental.reservation_date');
             } else {
                 $scope.client = $stateParams.dataTransition.client;
                 $scope.rooms = $stateParams.dataTransition.rooms;

                 $scope.data = {
                    type: 'days',
                    arrival_time: $stateParams.dataTransition.arrival_time,
                    arrival_date: $stateParams.dataTransition.arrival_date,
                    departure_date: $stateParams.dataTransition.departure_date,
                    state: $stateParams.dataTransition.state,
                    room_ids: []
                 }

                $scope.addRoom = function (roomId) {
                   $scope.data.room_ids = extendRoomService.addRoom(
                     $scope.rooms,
                     $scope.data.room_ids,
                     roomId
                   );
                }

                $scope.detachRoom = function (roomId) {
                  $scope.data.room_ids = extendRoomService.detachRoom(
                     $scope.rooms,
                     $scope.data.room_ids,
                     roomId
                  );
                }

                $scope.sendData = function () {
                  rentalService.storeReservation($scope.client.id, $scope.data)
                    .then(function (rental) {
                      showMessage.success('Reservacion registrada');

                      $state.go('menu.record.create_step', {dataTransition: {
                         rental: rental
                      }});
                    })
                    .catch(function (err) {
                       if(err.status == 401) {
                          $state.go('login');
                       } else if(err.status == 400) {
                          showMessage.error(err.data.message);
                       }
                    })
                }
            } 
             
        }
     ])

     .controller('reservationHourCreate', [
       '$scope',
       '$state',
       'showMessage',
       'time',
       'extendRoomService',
       'rentalService',
       'settingService',
       'clientService',

       function (
          $scope,
          $state,
          showMessage,
          time,
          extendRoomService,
          rentalService,
          settingService,
          clientService
       ) {
             $scope.client = {};

             $scope.availableHourReservationRoom = function () {
                $scope.arrival_time = time.setTime($scope.time);
                $scope.arrival_date = time.filterDate($scope.start_date);
              
                var endTime = time.getEndTime(
                   $scope.arrival_time,
                   $scope.departure_time,
                   $scope.setting.time_minimum
                );

                $scope.rooms = [];

                rentalService.getAvailableHour(
                    $scope.arrival_date,         
                    $scope.arrival_time,
                    endTime
                )
                .then(function (rooms) {
                    $scope.rooms = extendRoomService.extendRooms(rooms);

                    $state.go('menu.rental.room_reservation_hour', {dataTransition: {
                        arrival_time: $scope.arrival_time,
                        arrival_date: $scope.arrival_date,
                        departure_time: time.setTime($scope.departure_time),
                        state: $scope.state,
                        rooms: $scope.rooms,
                        client: $scope.client
                    }})
                })
                .catch(function (err) {
                    if(err.status == 401) {
                        $state.go('login');
                    } else if(err.status == 400) {
                        showMessage.error(err.data.message);
                    }
                })
             }

             $scope.searchClient = function () {
               clientService.findByIdentityCard($scope.identity_card)
                .then(function (client) {
                   $scope.client = client;
                   
                   return settingService.getSetting();
                })
                .then(function (setting) {
                    $scope.setting = setting;
                    $scope.availableHourReservationRoom();
                })
                .catch(function (err) {
                    if(err.status == 401) {
                        $state.go('login');
                    } else if(err.status == 404) {
                       showMessage.error('No existe cliente con esta cedula');
                    }
                })
            }

             $scope.sendData = function ($event) {
                $event.preventDefault();

                if($scope.client.id == undefined ) {
                    $scope.searchClient();
                } else {
                    $scope.availableHourReservationRoom();
                }
            }
       }
    ])

    .controller('reservationHourRoom', [
        '$scope',
        '$state',
        '$stateParams',
        'showMessage',
        'rentalService',
        'extendRoomService',

        function (
          $scope,
          $state,
          $stateParams,
          showMessage,
          rentalService,
          extendRoomService
        ) {  
             if($stateParams.dataTransition == null) {
                $state.go('menu.rental.reservation_hour');
             } else {
                $scope.client = $stateParams.dataTransition.client;
                $scope.rooms = $stateParams.dataTransition.rooms;

                $scope.data = {
                  type: 'hours',
                  arrival_date: $stateParams.dataTransition.arrival_date,
                  arrival_time: $stateParams.dataTransition.arrival_time,
                  departure_time: $stateParams.dataTransition.departure_time,
                  state: $stateParams.dataTransition.state,
                  room_ids: []
                }

                $scope.addRoom = function (roomId) {
                  $scope.data.room_ids = extendRoomService.addRoom(
                      $scope.rooms,
                      $scope.data.room_ids,
                      roomId
                  );
                }

                $scope.detachRoom = function (roomId) {
                  $scope.data.room_ids = extendRoomService.detachRoom(
                      $scope.rooms,
                      $scope.data.room_ids,
                      roomId
                  )
                }

                $scope.sendData = function () {
                  rentalService.storeReservation($scope.client.id, $scope.data)
                    .then(function (rental) {
                      showMessage.success('Reservacion registrada');

                      $state.go('menu.record.create_step', {dataTransition: {
                         rental: rental
                      }});
                    })
                    .catch(function (err) {
                       if(err.status == 401) {
                          $state.go('login');
                       } else if(err.status == 400) {
                          showMessage.error(err.data.message);
                       }
                    })
                }
             }
        }
    ])

    .controller('reservationDateEdit',  [
       '$scope', 
       '$state',
       '$stateParams', 
       'showMessage', 
       'time',
       'extendRoomService',
       'rentalService',

       function (
          $scope,
          $state,
          $stateParams,
          showMessage,
          time,
          extendRoomService,
          rentalService
        ) {
             $scope.notFound = false;
             $scope.loading = false;

             rentalService.getEnabledRooms($stateParams.id)
             .then(function (data) {
                $scope.loading = true;
                $scope.rental = rentalService.formatDataEdit(data.rental),
                $scope.currentRooms = extendRoomService.extendRooms(data.available_rooms);
             })
             .catch(function (err) {
                $scope.notFound = true;
             });

            $scope.availableDateReservationRoom = function ($event) {
                $event.preventDefault();

                $scope.rooms = [];
                
                $scope.rental.arrival_time = time.setTime($scope.rental.time);
                $scope.rental.room_ids = [];

                rentalService.getConfirmDateRooms(
                  $scope.rental.id,
                  time.filterDate($scope.rental.arrival_date),
                  time.filterDate($scope.rental.departure_date),
                  $scope.rental.arrival_time
                )
                .then(function(data) {
                    $scope.select = data.select;
                    $scope.loadRooms(data.rooms);

                    $state.go('menu.rental.room_reservation_date_edit', {dataTransition: {
                        rental: $scope.rental,
                        rooms: $scope.rooms,
                        select: $scope.select,
                        currentRooms: $scope.currentRooms,
                        countRoom: $scope.countRoom,
                        maxRoom: $scope.maxRoom
                    }})
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

            }
       }
    ])

    .controller('reservationDateEditRoom', [
        '$scope',
        '$state',
        '$stateParams',
        'showMessage',
        'rentalService',
        'extendRoomService',

        function (
          $scope,
          $state,
          $stateParams,
          showMessage,
          rentalService,
          extendRoomService
        ) {  
             if($stateParams.dataTransition == null) {
                 $state.go('/');
             } else {
                 $scope.select = $stateParams.dataTransition.select;
                 $scope.rental = $stateParams.dataTransition.rental;
                 $scope.rooms = $stateParams.dataTransition.rooms;
                 $scope.countRoom = $stateParams.dataTransition.countRoom;
                 $scope.maxRoom = $stateParams.dataTransition.maxRoom;
                 $scope.currentRooms = $stateParams.dataTransition.currentRooms;
                 
                 $scope.countAll = function () {
                     $scope.all = $scope.rental.room_ids.length == $scope.maxRoom;
                 }

                 $scope.countAll();

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

                $scope.sendData = function () {
                  rentalService.updateReservationDate($scope.rental)
                  .then(function (res) {
                     showMessage.success('Reservacion actualizada');
                    
                     if($scope.rental.record == null) {
                        $state.go('menu.record.create_step', {dataTransition: {
                           rental: $scope.rental
                        }});
                     } else {
                        $state.go('menu.record.edit_step', {dataTransition: {
                           record: $scope.rental.record
                        }});
                     }
                  })
                  .catch(function (err) {
                     if(err.status == 404) {
                        showMessage.error(err.data.message);
                     }
                  })
                }
             }
        }
    ])

    .controller('reservationHourEdit', [
        '$scope',
        '$state',
        '$stateParams',
        'showMessage',
        'time',
        'extendRoomService',
        'rentalService',
        'settingService',

        function (
           $scope,
           $state,
           $stateParams,
           showMessage,
           time,
           extendRoomService,
           rentalService,
           settingService
        ) {
             $scope.notFound = false;
             $scope.loading = false;

            rentalService.getEnabledRooms($stateParams.id)
            .then(function (data) {
                $scope.rental = rentalService.formatHourDataEdit(data.rental);
                $scope.currentRooms = extendRoomService.extendRooms(data.available_rooms);
                
                return settingService.getSetting();
            })
            .then(function (setting) {
                $scope.setting = setting;
                $scope.loading = true;
            })
            .catch(function (err) {
                $scope.notFound = true;
            });

            $scope.availableHourReservationRoom = function ($event) {
                $event.preventDefault();

                $scope.rental.arrival_time = time.setTime($scope.rental.time);
                $scope.rental.departure_time = time.setTime($scope.rental.time_close);
                $scope.rental.arrival_date = time.filterDate($scope.rental.start_date);

                var endTime = time.getEndTime(
                   $scope.rental.arrival_time, 
                   $scope.rental.time_close,
                   $scope.setting.time_minimum
                );

                $scope.rooms = [];
                $scope.rental.room_ids = [];
               
                rentalService.getConfirmHourRooms(
                  $scope.rental.id,
                  $scope.rental.arrival_date,
                  $scope.rental.arrival_time,
                  endTime
                )
                .then(function (data) {
                    $scope.select = data.select;
                    $scope.loadRooms(data.rooms);

                    $state.go('menu.rental.room_reservation_hour_edit', {dataTransition: {
                        rental: $scope.rental,
                        rooms: $scope.rooms,
                        select: $scope.select,
                        currentRooms: $scope.currentRooms,
                        countRoom: $scope.countRoom,
                        maxRoom: $scope.maxRoom
                    }})

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
            }
        }
    ])

    .controller('reservationHourEditRoom', [
       '$scope',
       '$state',
       '$stateParams',
       'showMessage',
       'rentalService',
       'extendRoomService',

       function (
          $scope,
          $state,
          $stateParams,
          showMessage,
          rentalService,
          extendRoomService
       ) {
            if($stateParams.dataTransition == null) {
                 $state.go('/');
             } else {

                 $scope.select = $stateParams.dataTransition.select;
                 $scope.rental = $stateParams.dataTransition.rental;
                 $scope.rooms = $stateParams.dataTransition.rooms;
                 $scope.countRoom = $stateParams.dataTransition.countRoom;
                 $scope.maxRoom = $stateParams.dataTransition.maxRoom;
                 $scope.currentRooms = $stateParams.dataTransition.currentRooms;
                 
                 $scope.countAll = function () {
                     $scope.all = $scope.rental.room_ids.length == $scope.maxRoom;
                 }

                 $scope.countAll();

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
             }

             $scope.sendData = function () {
                rentalService.updateReservationHour($scope.rental)
                .then(function (res) {
                    showMessage.success('Reservacion actualizada');

                     if($scope.rental.record == null) {
                        $state.go('menu.record.create_step', {dataTransition: {
                           rental: $scope.rental
                        }});
                     } else {
                        $state.go('menu.record.edit_step', {dataTransition: {
                           record: $scope.rental.record
                        }});
                     }
                })
                .catch(function (err) {
                    if(err.status == 400) {
                        showMessage.error(err.data.message);
                    }
                })
             }
       }
    ])

   .controller('reservationList', [
      '$scope',
      '$state',
      'time',
      'showMessage',
      'DTOptionsBuilder',
      'rentalService',
      'settingService',

      function(
        $scope,
        $state,
        time,
        showMessage,
        DTOptionsBuilder,
        rentalService,
        settingService
      ) {
           var currentDate = time.getDate();

           $scope.startDate = time.formatDate(currentDate);
           $scope.endDate = time.getDayAfter();
           $scope.reservations = [];

           $scope.dtOptions = DTOptionsBuilder.newOptions()
             .withLanguage(settingService.getSettingTable())
             .withDOM('ftp')
             .withBootstrap();

          $scope.getReservations = function () {
            rentalService.getReservations(
              time.filterDate($scope.startDate), 
              time.filterDate($scope.endDate)
            )
            .then(function(reservations) {
                $scope.reservations = reservations;
            })
            .catch(function (err) {
               console.log(err);
            })
          }

          $scope.getReservations();

          $scope.show = function (id) {
             $state.go('menu.rental.show', {id: id});
          }

          $scope.edit = function (id) {
            var reservation  = _.find($scope.reservations, function (reservation) {
              return  reservation.id == id;
            });

            if(reservation.type == 'days') {
                $state.go('menu.rental.reservation_date_edit', {id: id});
            } else {
                $state.go('menu.rental.reservation_hour_edit', {id: id});
            }
          }

          $scope.deleteReservation = function () {
            rentalService.deleteRental($scope.deleteReservaionId)
            .then(function (res) {
              showMessage.success(res.message);

              var filterReservations =  _.filter($scope.reservations, function (reservation) {
                return reservation.id != $scope.deleteReservaionId
              });

              $scope.reservations = filterReservations;
            })
            .catch(function (err) {
               if(err.status == 400) {
                 showMessage.error(err.data.message);
               }
            })
          }

          $scope.confirmDeleteReservation = function (reservationId) {
            var message = 'Esta seguro de eliminar reservacion';

            $scope.deleteReservaionId = reservationId;

            alertify.confirm(message, $scope.deleteReservation)
               .setting({
                 'title': 'Eliminar Reservacion',
                 'labels': {
                   'ok': 'Confirmar',
                   'cancel': 'Cancelar'
                 }
            });
          }
      }
    ])

    .controller('reservationPending', [
       '$scope',
       '$state',
       'showMessage',
       'DTOptionsBuilder',
       'rentalService',
       'settingService',

       function (
         $scope,
         $state,
         showMessage,
         DTOptionsBuilder,
         rentalService,
         settingService
       ) {  

           $scope.dtOptions = DTOptionsBuilder.newOptions()
           .withLanguage(settingService.getSettingTable())
           .withDOM('ftp')
           .withBootstrap();

           rentalService.getReservationsPending()
           .then(function (reservations) {
             $scope.reservations = reservations;
           })
           .catch(function (err) {
             console.log(err);
           });

           $scope.show = function (id) {
              $state.go('menu.rental.show', {id: id});
           }

           $scope.confirmReservation = function (reservationId) {
             rentalService.confirmReservation(reservationId)
             .then(function (res) {
               showMessage.success('Reservacion confirmada');
                  
               var filterReservations =  _.filter($scope.reservations, function (reservation) {
                 return reservation.id != reservationId
               });

               $scope.reservations = filterReservations;
             })
             .catch(function (err) {
                if(err.status == 400) {
                  showMessage.error(err.data.message);
                }
             })
           }
       }
     ])


})(_, alertify)