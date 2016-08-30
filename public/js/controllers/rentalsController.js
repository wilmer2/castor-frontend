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
                identity_card: '',
                arrival_date: time.getDate(),
                type: 'hours'
             };

             $scope.availableHourRooms = function () {
                var currenTime = time.getHour();
                var endTime = $scope.getEndTime(currenTime);

                $scope.rooms = [];
                $scope.rental.room_ids = [];

                rentalService.getAvailableHour(
                  $scope.rental.arrival_date,
                  currenTime,
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

             $scope.getEndTime = function (currenTime) {
                if($scope.rental.time_close == null || $scope.rental.time_close == '') {
                    var endTime = time.sumHours(
                      time.formatTime(currenTime), 
                      $scope.setting.time_minimum
                    );

                    return endTime;
                } else {
                    $scope.rental.departure_time = time.setTime($scope.rental.time_close);

                    return $scope.rental.departure_time;
                }
             }

             $scope.loadSetting = function () {
                settingService.getSetting()
                .then(function (setting) {
                    $scope.setting = setting;
                    $scope.loading = true;
                    $scope.availableHourRooms();
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
                  time.filterDate($scope.rental.departure_date), 
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

                 rentalService.getAvailableDate(
                   time.getDate(),
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
                    rentalService.getAvailableDate(
                      time.filterDate($scope.rental.arrival_date), 
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
                var currenTime = time.getHour();
                var currenDate = time.getDate();
                var startTime = time.setTime($scope.rental.time);
                var startDate = time.filterDate($scope.rental.arrival_date);

                if(
                   currenDate < startDate || 
                   currenDate == startDate && 
                   startTime >= currenTime
                ) {
                    return startTime;
                } else {
                    return currenTime;
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