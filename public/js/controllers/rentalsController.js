(function () {
    angular.module('castor.controllers')

    .controller('rentalShow', [
      '$scope',
      '$state',
      '$stateParams',
      'showMessage',
      'DTOptionsBuilder',
      'settingService',
      'rentalService',

      function (
        $scope,
        $state,
        $stateParams,
        showMessage,
        DTOptionsBuilder,
        settingService,
        rentalService
      ) {
           $scope.notFound = false;
           $scope.loading = false;

           $scope.dtOptions = DTOptionsBuilder.newOptions()
           .withLanguage(settingService.getSettingTable())
           .withDOM('ftp')
           .withBootstrap();

           rentalService.getRental($stateParams.id)
           .then(function (data) {
              $scope.loading = true;
              $scope.rental = data;
              $scope.client = data.client;
              $scope.rooms = data.rooms;
           })
           .catch(function (err) {
              if(err.status == 404) {
                  $scope.notFound = true;
                  $scope.loading = true;
              } else if(err.status == 401) {
                  $state.go('login');
              }
           });

           $scope.addRoom = function () {
              if($scope.rental.type == 'days') {
                  $state.go('menu.rental.add_room_date', {id: $scope.rental.id})
              } else {
                  $state.go('menu.rental.add_room_hour', {id: $scope.rental.id});
              }
              
           }

           $scope.checkout = function () {
              rentalService.checkout($scope.rental.id)
              .then(function (rental) {
                  showMessage.success('Salida confirmada');
                  $scope.rental = rental;
              })
              .catch(function (err) {
                  if(err.status == 400) {
                      showMessage.error(err.data.message);
                  } else if(err.status == 401) {
                      $state.go('login');
                  }
              })
           }

           $scope.confirmReservation = function () {
               rentalService.confirmReservation($scope.rental.id)
               .then(function (rental) {
                  showMessage.success('Reservacion confirmada');
                  $scope.rental = rental;
               })
               .catch(function (err) {
                  if(err.status == 400) {
                      showMessage.error(err.data.message);
                  } else if(err.status == 401) {
                      $state.go('login');
                  }
               })
           }

           $scope.delete = function () {
              rentalService.deleteRental($scope.rental.id)
              .then(function (res) {
                 showMessage.success(res.message);
                 $state.go('menu.rental.list');
              })
              .catch(function (err) {
                 if(err.status == 404) {
                    showMessage.error('Hospedaje no encontrado');
                    $state.go('menu.rental.list');

                 } else if(err.status == 400) {
                     showMessage.error(err.data.message);
                 } else if(err.status == 401) {
                     $state.go('login');
                 }
              })
          }

          $scope.deleteRoom = function () {
              rentalService.deleteRoom($scope.rental.id, $scope.deleteRoomId)
              .then(function (rental) {
                  showMessage.success('Habitacion eliminada');
                  $scope.rental = rental;

                  var filterRooms =  _.filter($scope.rooms, function (room) {
                     return room.id != $scope.deleteRoomId;
                  })

                  $scope.rooms = filterRooms;
              })
              .catch(function (err) {
                  showMessage.error(err.data.message);
              }) 
          }

          $scope.editRecord = function () {
             if($scope.rental.record == null) {
                $state.go('menu.record.create', {dataTransition: {
                  rental: $scope.rental
                }});

             } else {
                $state.go('menu.record.edit', {dataTransition: {
                  record: $scope.rental.record
                }});
             }
          }

          $scope.confirmCheckout = function () {
            var message = 'Esta seguro de confirmar salida';

            alertify.confirm(message, $scope.checkout)
            .setting({
              'title': 'Confirmar Salida',
              'labels': {
                'ok': 'Confirmar',
                'cancel': 'Cancelar'
              }
            });
          }

          $scope.confirmDeleteRental = function () {
            var message = 'Esta seguro de eliminar hospedaje';

            alertify.confirm(message, $scope.delete)
            .setting({
              'title': 'Eliminar Hospedaje',
              'labels': {
                'ok': 'Confirmar',
                'cancel': 'Cancelar'
              }
            });
          }

          $scope.confirmDeleteRoom = function (roomId) {
            var message = 'Esta seguro de eliminar habitacon';
            $scope.deleteRoomId = roomId;

            alertify.confirm(message, $scope.deleteRoom)
            .setting({
              'title': 'Eliminar Hospedaje',
              'labels': {
                'ok': 'Confirmar',
                'cancel': 'Cancelar'
              }
            });
          }

          $scope.changeRoom = function (roomId) {
            $state.go('menu.rental.room_change', {id: $scope.rental.id, roomId: roomId});
          }
      }
    ])

    .controller('rentalList', [
      '$scope', 
      '$state',
      'showMessage', 
      'DTOptionsBuilder',
      'settingService',
      'rentalService',

      function (
        $scope, 
        $state, 
        showMessage,
        DTOptionsBuilder,
        settingService,
        rentalService
      ) {
           $scope.rentals = [];

           $scope.dtOptions = DTOptionsBuilder.newOptions()
           .withLanguage(settingService.getSettingTable())
           .withDOM('ftp')
           .withBootstrap();

           rentalService.all()
           .then(function (rentals) {
              $scope.rentals = rentals
           })
           .catch(function (err) {
              console.log('error');
           });

           $scope.show = function (rentalId) {
              $state.go('menu.rental.show', {id: rentalId});
           }

           $scope.renovate = function (rentalId) {
              var rental = _.find($scope.rentals, function (rental) {
                 return rental.id == rentalId;
              });

              if(rental.type == 'days') {
                  $state.go('menu.rental.renovate_date', {id: rental.id});
              } else {
                  $state.go('menu.rental.renovate_hour', {id: rental.id});
              }
           }

           $scope.checkout = function () {
             rentalService.checkout($scope.rentalCheckoutId)
             .then(function (rental) {
                showMessage.success('Salida confirmada');
                   
                var rentals = _.filter($scope.rentals, function (rental) {
                  return rental.id != $scope.rentalCheckoutId;
                });

                $scope.rentals = rentals;
             })
             .catch(function (err) {
                if(err.status == 400) {
                   showMessage.error(err.data.message);
                }
              })
             
           }

           $scope.confirmCheckout = function (rentalId) {
              var message = 'Esta seguro de confirmar salida';

              $scope.rentalCheckoutId = rentalId;

              alertify.confirm(message, $scope.checkout)
              .setting({
               'title': 'Confirmar salida',
                'labels': {
                  'ok': 'Confirmar',
                  'cancel': 'Cancelar'
                }
            });
           }
        }
    ])

    .controller('rentalCreateDate', [
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

             $scope.availableDateRooms = function () {
                $scope.rooms = [];

                rentalService.getAvailableDate(
                  time.getDate(),
                  time.filterDate($scope.departure_date),
                  time.getHour()
                )
                .then(function (rooms) {
                    $scope.rooms = extendRoomService.extendRooms(rooms);

                    $state.go('menu.rental.room_date', {dataTransition: {
                      rooms: $scope.rooms,
                      departure_date: $scope.departure_date,
                      client: $scope.client
                    }});
                })
                .catch(function (err) {
                    if(err.status == 400) {
                       showMessage.error(err.data.message);
                    }
                })
            }

            $scope.searchClient = function () {
               clientService.findByIdentityCard($scope.identity_card)
               .then(function (client) {
                   $scope.client = client;
                   $scope.availableDateRooms();
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
                    $scope.availableDateRooms();
                }
            }
        }
    ])


   .controller('rentalCreateHour', [
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
             $scope.arrival_date = time.getDate();

             $scope.availableHourRooms = function () {
                var currentTime = time.getHour();

                var endTime = time.getEndTime(
                   currentTime,
                   $scope.departure_time,
                   $scope.setting.time_minimum
                );
                
                $scope.rooms = [];

                rentalService.getAvailableHour(
                  $scope.arrival_date,
                  currentTime,
                  endTime
                ).then(function (rooms) {
                    $scope.rooms = extendRoomService.extendRooms(rooms);
                    $state.go('menu.rental.room_hour', {dataTransition: {
                      rooms: $scope.rooms,
                      client: $scope.client,
                      arrival_date: $scope.arrival_date,
                      departure_time: time.setTime($scope.departure_time)
                    }})
                })
                .catch(function (err) {
                    showMessage.error(err.data.message);
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
                    $scope.availableHourRooms();
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
                    $scope.availableHourRooms();
                }
            }
        }
    ])
    
    .controller('rentalHourRoom', [
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
                 $state.go('menu.rental.hour');
             } else {

                 $scope.client = $stateParams.dataTransition.client;
                 $scope.rooms = $stateParams.dataTransition.rooms;

                 $scope.data = {
                   arrival_date: $stateParams.dataTransition.arrival_date,
                   departure_time : $stateParams.dataTransition.departure_time,
                   type: 'hours',
                   room_ids: [],
                 };

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
                   rentalService.store($scope.client.id, $scope.data)
                    .then(function (rental) {
                        showMessage.success('Hospedaje ha sido registrado');

                        $state.go('menu.record.create_step', {dataTransition: {
                          rental: rental
                        }});
                    })
                    .catch(function (err) {
                        if(err.status == 400) {
                            showMessage.error(err.data.message);
                        }
                    });
                }
             }
        }
    ])

    .controller('rentalDateRoom', [
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

             if($stateParams.dataTransition == null)  {
                 $state.go('menu.rental.date');
             } else {
                 $scope.client = $stateParams.dataTransition.client;

                 $scope.data = {
                   type: 'days',
                   room_ids: [],
                   departure_date: $stateParams.dataTransition.departure_date
                 };

                 $scope.rooms = $stateParams.dataTransition.rooms

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
                    rentalService.store($scope.client.id, $scope.data)
                    .then(function (rental) {
                        showMessage.success('Hospedaje ha sido registrado');

                        $state.go('menu.record.create_step', {dataTransition: {
                          rental: rental
                        }})
                    })
                    .catch(function (err) {
                        if(err.status == 400) {
                            showMessage.error(err.data.message);
                        }
                    });
                }
             }             
       }
    ])

    .controller('renovateDate', [
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

                $scope.rooms = [];
                $scope.rental.room_ids = [];

                var currentTime = time.getHour();

                rentalService.getConfirmDateRooms(
                  $scope.rental.id,
                  $scope.rental.old_departure,
                  time.filterDate($scope.rental.departure_date),
                  currentTime
                )
                .then(function (data) {
                    $scope.select = data.select;
                    $scope.loadRooms(data.rooms);

                    $state.go('menu.rental.room_renovate_date', {dataTransition: {
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

     .controller('renovateDateRooms', [
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
             if($stateParams.dataTransition == null)  {
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

                   rentalService.sendRenovateDate($scope.rental).then(function (rental) {
                       console.log(rental);
                       showMessage.success('Renovacion registrada');
                   })
                   .catch(function (err) {
                       showMessage.error(err.data.message);
                   });
                 }
             }
        }
      ])

     .controller('renovateHour', [
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
                $scope.rental = rentalService.formatDataEdit(data.rental);
                $scope.currentRooms = extendRoomService.extendRooms(data.available_rooms);
                $scope.loading = true;
             })
            .catch(function (err) {
                $scope.notFound = true;
            });

            $scope.availableHourRooms = function ($event) {
                $event.preventDefault();

                $scope.rooms = [];
                $scope.rental.room_ids = [];

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
                   $scope.select = data.select;
                   $scope.loadRooms(data.rooms);

                   $state.go('menu.rental.room_renovate_hour', {dataTransition: {
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

      .controller('renovateHourRoom', [
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
               if($stateParams.dataTransition == null)  {
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
                   rentalService.sendRenovateHour($scope.rental).then(function (rental) {
                       console.log(rental);
                       showMessage.success('Renovacion registrada');
                   })
                   .catch(function (err) {
                       showMessage.error(err.data.message);
                   });
                 }
             }
          }
       ])

      .controller('addRoomDate', [
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

                 rentalService.getAvailableDateAdd(
                   time.filterDate(startDate),
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
                .then(function (res) {
                    showMessage.success(res.message);
                    $state.go('menu.rental.show', {id: $scope.rental.id});
                })
                .catch(function (err) {
                    showMessage.error(err.data.message);
                })
              }

          }
      ])

      .controller('addRoomHour', [
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
              $scope.loadingRoom = false;
              $scope.all = false;
              $scope.timeOut = false;

              $scope.isTimeOut = function () {
                if(!$scope.rental.reservation && !$scope.rental.checkout) {
                    var date = time.filterDate($scope.rental.arrival_date);
                    var currentDate = time.getDate();
                    var currentHour = time.getHour();

                    if($scope.rental.departure_date != null) {
                       date = time.filterDate($scope.rental.departure_date);
                    } 

                    if(date == currentDate && currentHour >= $scope.rental.departure_time) {
                        $scope.loading = true;
                        $scope.timeOut = true;
                    } else {
                        $scope.availableHourRooms();
                    }

                } else if($scope.rental.reservation) {
                     $scope.availableHourRooms();
                }
                
              }

              rentalService.getRental($stateParams.id)
              .then(function (data) {
                 $scope.rental = rentalService.formatDataEdit(data);

                 if($scope.rental.type == 'hours') {
                    $scope.rental.arrival_time = time.setTime($scope.rental.time);
                    $scope.isTimeOut();
                 }
                 
              })
              .catch(function (err) {
                 $scope.notFound = true;
              });

              $scope.availableHourRooms = function () {
                  $scope.loading = true;
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
                   .then(function (res) {
                      showMessage.success(res.message);
                      $state.go('menu.rental.show', {id: $scope.rental.id});
                  })
                  .catch(function (err) {
                      showMessage.error(err.data.message);
                  })
              }
         }
      ])

     .controller('changeRoom', [
        '$scope',
        '$state',
        '$stateParams',
        'time',
        'showMessage',
        'extendRoomService',
        'rentalService',

        function (
          $scope,
          $state,
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
                      $scope.selectTime()
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
                    showMessage.success('La habitacion ha sido cambiada');
                    $state.go('menu.rental.show', {id: rental.id})
                })
                .catch(function (err) {
                    showMessage.error(err.data.message);
                })
             }
        }
      ])

})(_, alertify);