(function () {
    angular.module('castor.controllers')
    .controller('rentalCreateDate', [
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
          extendRoomService,
          rentalService,
          clientService
        ) {
             $scope.loadingRoom = false;
             $scope.client = {};
             $scope.notFound = false;
             $scope.loading = false;

             $scope.rental = {
                type: 'days',
                room_ids: [],
                identity_card: ''
            };

            $scope.availableDateRoom = function ($event) {
                $event.preventDefault();

                if($scope.rental.departure_date == null || $scope.rental.departure_date == '') {
                    showMessage.error('La fecha de salida es obligatoria');

                    return;
                }

                $scope.rooms = [];
                $scope.rental.room_ids = [];
                $scope.loadingRoom = false;

                rentalService.getAvailableDate(
                  time.getDate(),
                  time.filterDate($scope.rental.departure_date),
                  time.getHour()
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
                );
            }

            $scope.sendData = function ($event) {
                $event.preventDefault();

                if($scope.client.id == undefined && $scope.rental.identity_card == '') {
                    showMessage.error('La cedula es obligatoria');

                    return false;
                }

                rentalService.store($scope.client.id, $scope.rental)
               .then(function (rental) {
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

    .controller('rentalCreateHour', [
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

             $scope.rental = {
                arrival_date: time.getDate(),
                type: 'hours',
                identity_card: '',
             };

             $scope.availableHourRooms = function ($event) {
                $event.preventDefault();

                var currentTime = time.getHour();

                var endTime = time.getEndTime(
                   currentTime,
                   $scope.rental.time_close, 
                   $scope.setting.time_minimum
                );
                
                $scope.rental.departure_time = time.setTime($scope.rental.time_close);
                $scope.rooms = [];
                $scope.rental.room_ids = [];
                $scope.loadingRoom = false;

                rentalService.getAvailableHour(
                  $scope.rental.arrival_date,
                  currentTime,
                  endTime
                ).then(function (rooms) {
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
                );
            }

            $scope.sendHourData = function ($event) {
                $event.preventDefault();

                if($scope.client.id == undefined && $scope.rental.identity_card == '') {
                    showMessage.error('La cedula es obligatoria');

                    return false;
                }

                rentalService.store($scope.client.id, $scope.rental).then(function (rental) {
                    console.log(rental)
                    showMessage.success('El hospedaje ha sido registado');
                })
                .catch(function (err) {
                    if(err.status == 404) {
                        showMessage.error('Cliente no  registrado');
                    } else {
                        showMessage.error(err.data.message);
                    }
                })
            }
        }
    ])

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
            $scope.renovate = false;

            $scope.isRenovate = function () {
                 var currentDate = time.getDate();
                 
                 if(
                    currentDate == $scope.rental.old_departure &&
                    !$scope.rental.checkout || 
                    $scope.rental.type == 'hours' &&
                    !$scope.rental.checkout
                  ) {
                       $scope.renovate = true;
                }
            }

            rentalService.getEnabledRooms($stateParams.id)
            .then(function (data) {
                $scope.rental = rentalService.formatData(data.rental);
                $scope.currentRooms = extendRoomService.extendRooms(data.available_rooms);
                $scope.loading = true;

                if(!$scope.rental.reservation) {
                    $scope.isRenovate();
                }
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
                $scope.rental.room_ids = [];
                $scope.maxRoom = 0;
                $scope.all = false;
                $scope.countRoom = 0;
                $scope.loadRoom = false;

                var currentTime = time.getHour();

                rentalService.getConfirmDateRooms(
                  $scope.rental.id,
                  $scope.rental.old_departure,
                  time.filterDate($scope.rental.departure_date),
                  currentTime
                )
                .then(function (data) {
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

            $scope.sendRenovate = function ($event) {
                $event.preventDefault();

                rentalService.sendRenovateDate($scope.rental).then(function (rental) {
                    console.log(rental);
                    showMessage.success('Renovacion registrada');
                })
                .catch(function (err) {
                    showMessage.error(err.data.message);
                });
            }
        }
     ])

     .controller('renovateHour', [
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
                $scope.rental = rentalService.formatDataEdit(data.rental);
                $scope.currentRooms = extendRoomService.extendRooms(data.available_rooms);
                $scope.loading = true;
             })
            .catch(function (err) {
                $scope.notFound = true;
            });

            $scope.availableHourRooms = function ($event) {
                $event.preventDefault();

                if(
                    $scope.rental.renovate_hour == '' || 
                    $scope.rental.renovate_hour == undefined
                ) {
                    showMessage.error('Debe ingresar cantidad de horas a renovar');
                    return false;
                }

                $scope.rooms = [];
                $scope.rental.room_ids = [];
                $scope.maxRoom = 0;
                $scope.all = false;
                $scope.countRoom = 0;
                $scope.loadingRoom = false;

                var renovateHour = time.sumHours(
                    time.formatTime($scope.rental.departure_time), 
                    $scope.rental.renovate_hour
               );
                   
               rentalService.getConfirmHourRooms(
                  $scope.rental.id, 
                  time.filterDate($scope.rental.arrival_date), 
                  $scope.rental.departure_time, 
                  renovateHour
               )
               .then(function (data) {
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

            $scope.sendRenovateHour = function ($event) {
                $event.preventDefault();

                rentalService.sendRenovateHour($scope.rental).then(function (rental) {
                     console.log(rental.id);
                     showMessage.success('Renovacion registrada');
                })
                .catch(function (err) {
                     showMessage.error(err.data.message);
                })
            }

         }
      ])

      .controller('addRoomDate', [
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
              $scope.all = false;

              rentalService.getRental($stateParams.id)
              .then(function (data) {
                 $scope.rental = rentalService.formatDataEdit(data);
                 $scope.loading = true;
                 $scope.availableDateRooms();
              })
              .catch(function (err) {
                 $scope.notFound = true;
              });

              $scope.availableDateRooms = function () {
                 $scope.rooms = [];

                 var startDate = time.getDate();

                 if($scope.rental.reservation) {
                     startDate = $scope.rental.arrival_date;
                 }

                 rentalService.getAvailableDate(
                   startDate,
                   time.filterDate($scope.rental.departure_date),
                   time.getHour()
                 ).then(function (rooms) {
                     $scope.loadingRoom = true;
                     $scope.rooms = extendRoomService.extendRooms(rooms);
                 });
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
                 );
              }

              $scope.addRoomForDate = function () {
                rentalService.addRoomForDate($scope.rental)
                .then(function (rental) {
                    console.log(rental);
                    showMessage.success('Las habitaciones han sido agregadas');
                })
                .catch(function (err) {
                    showMessage.error(err.data.message);
                })
              }

          }
      ])

      .controller('addRoomHour', [
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
              $scope.all = false;

              rentalService.getRental($stateParams.id)
              .then(function (data) {
                 $scope.rental = rentalService.formatDataEdit(data);
                 $scope.loading = true;
                 $scope.rental.arrival_time = time.setTime($scope.rental.time);
                 $scope.availableHourRooms();
              })
              .catch(function (err) {
                 $scope.notFound = true;
              });

              $scope.availableHourRooms = function () {
                  $scope.rooms = [];

                  rentalService.getAvailableHourAdd(
                    time.filterDate($scope.rental.arrival_date),
                    time.setTime($scope.rental.time),
                    $scope.rental.departure_time
                  )
                  .then(function (rooms) {
                      $scope.loadingRoom = true;
                      $scope.rooms = extendRoomService.extendRooms(rooms);
                  })
                  .catch(function (err) {
                      showMessage.error(err.data.message);
                  })
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
                 );
              }

              $scope.addRoomForHour = function ($event) {
                  $event.preventDefault();

                  rentalService.addRoomForHour($scope.rental)
                   .then(function (rental) {
                      console.log(rental.id);
                      showMessage.success('Las habitaciones han sido registradas');
                  })
                  .catch(function (err) {
                      showMessage.error(err.data.message);
                  })
              }
         }
      ])

     .controller('changeRoom', [
        '$scope',
        '$stateParams',
        'time',
        'showMessage',
        'extendRoomService',
        'rentalService',

        function (
          $scope,
          $stateParams,
          time,
          showMessage,
          extendRoomService,
          rentalService
        ) {
             rentalService.getEnabledRooms($stateParams.id)
             .then(function (data) {
                $scope.rental = rentalService.formatDataEdit(data.rental);
                $scope.currentRooms = extendRoomService.extendRooms(data.available_rooms);
                $scope.loading = true;
                $scope.rental.room_id = '';
                $scope.rental.state = 'disponible';

                $scope.searchRoom($stateParams.roomId);
             })
             .catch(function (err) {
                $scope.notFound = true;
             });

             $scope.searchRoom = function (roomId) {
                $scope.currentRoom = extendRoomService.findRoom(
                  $scope.currentRooms,
                  roomId
                );

                if($scope.currentRoom == undefined) {
                    $scope.roomNotFound = true;
                } else {
                    if(!$scope.rental.checkout) {
                       $scope.loadRooms();
                    }
                }
             }

             $scope.loadRooms = function () {
                $scope.loadingRoom = true;

                if($scope.rental.type == 'days') {
                    var startDate = time.filterDate($scope.rental.arrival_date);
                    var currentDate = time.getDate();

                    if(currentDate > startDate) {
                        startDate = currentDate;
                    }

                    rentalService.getAvailableDate(
                      startDate, 
                      time.filterDate($scope.rental.departure_date), 
                      time.getHour()
                    )
                    .then(function (rooms) {
                       $scope.rooms = rooms;
                    })
                    .catch(function (err) {
                        showMessage.error(err.data.message);
                    }) 
                } else {
                    var date = $scope.getDateHour();
                    var selectTime = $scope.selectTime();

                    rentalService.getAvailableHourAdd(
                      date,
                      selectTime,
                      $scope.rental.departure_time
                    )
                    .then(function (rooms) {
                        $scope.rooms = rooms
                    });
                }
             }

             $scope.getDateHour = function () {
                 var currentDate = time.getDate();
                 var arrivalDate = time.filterDate($scope.rental.arrival_date);
                 var departureDate = time.filterDate($scope.rental.departure_date);

                 if(currentDate <= arrivalDate) {
                    return arrivalDate;
                 } else {
                    return departureDate;
                 }
             }

             $scope.selectTime = function () {
                var currentTime = time.getHour();
                var currentDate = time.getDate();
                var startTime = time.setTime($scope.rental.time);
                var startDate = time.filterDate($scope.rental.arrival_date);

                if(
                   currentDate < startDate || 
                   currentDate == startDate && 
                   startTime >= currentTime
                ) {
                    return startTime;
                } else {
                    return currentTime;
                }
             }


             $scope.addRoom = function (roomId) {
                $scope.rental.room_ids = extendRoomService.addRoom(
                    $scope.rooms,
                    $scope.rental.room_ids,
                    roomId
                 );

                $scope.rental.room_id = roomId;
                $scope.all = true;

             }

              $scope.detachRoom = function (roomId) {
                 $scope.rental.room_ids = extendRoomService.detachRoom(
                     $scope.rooms,
                     $scope.rental.room_ids,
                     roomId
                 );

                 $scope.rental.room_id = '';
                 $scope.all = false;

              }

             $scope.changeRoom = function ($event) {
                $event.preventDefault();
              
                rentalService.changeRoom($scope.rental, $scope.currentRoom.roomId)
                .then(function (rental) {
                    console.log(rental.id);
                    showMessage.success('La habitacion ha sido cambiada');
                })
                .catch(function (err) {
                    showMessage.error(err.data.message);
                })
             }
        }
      ])

})(_);