(function () {
    angular.module('castor.controllers')

    .controller('clientShow', [
        '$scope',
        '$state', 
        '$stateParams', 
        'showMessage',
        'clientService',

        function ($scope, $state, $stateParams, showMessage,clientService) {
           $scope.loading = false;
           $scope.notFound = false;

           clientService.findClient($stateParams.id)
           .then(function (client) {
              $scope.loading = true;
              $scope.client = client;
           })
           .catch(function (err) {
              $scope.loading = true;
              $scope.notFound = true;
           })

           $scope.edit = function () {
               $state.go('menu.client.edit', {id: $scope.client.id});
           }

           $scope.delete = function () {
              clientService.deleteClient($scope.client.id)
              .then(function (res) {
                 showMessage.success(res.message);
                 $state.go('menu.client.list');
              })
              .catch(function (err) {
                 if(err.status == 404) {
                    showMessage.error('Cliente no encontrado');
                    $state.go('menu.client.list');

                 }
              })
          }

          $scope.confirmDelete = function () {
            var message = "Esta seguro de eliminar cliente";

            alertify.confirm(message, $scope.delete)
            .setting({
              'title': 'Eliminar Cliente',
              'labels': {
                'ok': 'Confirmar',
                'cancel': 'Cancelar'
              }
            });
          }
        }
    ])

    .controller('clientCreate', ['$scope', '$state', 'showMessage', 'clientService',
        function ($scope, $state, showMessage, clientService) {
           $scope.sendData = function ($event) {
              $event.preventDefault();

              clientService.store($scope.client)
              .then(function (client) {
                  showMessage.success('Cliente ha sido registrado');
                  $state.go('menu.client.show', {id: client.id});
              })
              .catch(function (err) {
                  showMessage.error(err.data.message);
              })
           }
        }
    ])

    .controller('clientEdit', [
        '$scope', 
        '$state', 
        '$stateParams', 
        'showMessage', 
        'clientService',

        function ($scope, $state, $stateParams,  showMessage, clientService) {
           $scope.loading = false;
           $scope.notFound = false;

           clientService.findClient($stateParams.id)
           .then(function (client) {
              $scope.loading = true;
              $scope.client = client;
           })
           .catch(function (err) {
              $scope.loading = true;
              $scope.notFound = true;
           })

           $scope.sendData = function () {
              clientService.update($scope.client)
              .then(function (client) {
                  $state.go('menu.client.show', {id: client.id})
                  showMessage.success('El cliente ha sido actualizado');
              })
              .catch(function (err) {
                  showMessage.error(err.data.message);
              })
           }
        }
    ])

    .controller('clientList', [
        '$scope', 
        '$state',
        'DTOptionsBuilder', 
        'clientService', 
        'settingService',

        function ($scope, $state, DTOptionsBuilder, clientService, settingService) {
             $scope.clients = [];
             $scope.dtOptions = DTOptionsBuilder.newOptions()
             .withLanguage(settingService.getSettingTable())
             .withDOM('ftp')
             .withBootstrap()

             clientService.getClients()
             .then(function (clients) {
                 console.log('list promise');
                 $scope.clients = clients;
             })
             .catch(function (err) {
                 console.log(err);
             });

             $scope.show = function (clientId) {
                $state.go('menu.client.show', {id: clientId});
             }

        }
    ])

    .controller('clientRentals', [
        '$scope', 
        '$state',
        '$stateParams',
        'DTOptionsBuilder', 
        'clientService', 
        'settingService',

        function (
          $scope, 
          $state, 
          $stateParams, 
          DTOptionsBuilder, 
          clientService, 
          settingService
        ) {  
             $scope.notFound = false;
             $scope.loading = false;
             $scope.rentals = [];

             $scope.dtOptions = DTOptionsBuilder.newOptions()
              .withLanguage(settingService.getSettingTable())
              .withDOM('ftp')
              .withBootstrap();

             clientService.findClient($stateParams.id)
             .then(function (client) {
                $scope.client = client;

                return clientService.getRentals($scope.client.id)
             })
             .then(function (rentals) {
                $scope.rentals = rentals;
                $scope.loading = true;

             })
             .catch(function (err) {
                if(err.status == 404) {
                    $scope.notFound = true;
                    $scope.loading = true;
                }
             });

             $scope.show = function (id) {
                $state.go('menu.rental.show', {id: id});
             }

             $scope.rentalDay = function () {
                $state.go('menu.client.rental_date', {id: $scope.client.id});
             }

             $scope.rentalHour = function () {
                $state.go('menu.client.rental_hour', {id: $scope.client.id});
             }
        }
    ])

   .controller('clientReservations', [
      '$scope',
      '$state',
      '$stateParams',
      'showMessage',
      'DTOptionsBuilder',
      'clientService',
      'rentalService',
      'settingService',

      function (
        $scope,
        $state,
        $stateParams,
        showMessage,
        DTOptionsBuilder,
        clientService,
        rentalService,
        settingService
      ) {
           $scope.notFound = false;
           $scope.loading = false;
           $scope.reservations = [];

           $scope.dtOptions = DTOptionsBuilder.newOptions()
           .withLanguage(settingService.getSettingTable())
           .withDOM('ftp')
           .withBootstrap();

           clientService.findClient($stateParams.id)
           .then(function (client) {
              $scope.client = client;

              return clientService.getReservations($scope.client.id);
            })
            .then(function (reservations) {
               $scope.reservations = reservations;
               $scope.loading = true;

            })
            .catch(function (err) {
               if(err.status == 404) {
                  $scope.notFound = true;
                  $scope.loading = true;
               }
            });

            $scope.show = function (id) {
              $state.go('menu.rental.show', {id: id});
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

            $scope.reservationHour = function () {
              $state.go('menu.client.reservation_hour', {id: $scope.client.id});
            }

            $scope.reservationDay = function () {
              $state.go('menu.client.reservation_date', {id: $scope.client.id});
            }

      }

    ])

    .controller('clientRentalDate', [
        '$scope',
        '$state',
        '$stateParams',
        'showMessage',
        'time',
        'extendRoomService',
        'rentalService',
        'clientService',

        function(
          $scope,
          $state,
          $stateParams,
          showMessage,
          time,
          extendRoomService,
          rentalService,
          clientService
        ) {  
             $scope.loading = false;
             $scope.notFound = false;
             $scope.data = {};

             clientService.findClient($stateParams.id)
             .then(function (client) {
                $scope.loading = true;
                $scope.client = client;
             })
             .catch(function (err) {
                $scope.loading = true;
                $scope.notFound = true;
             })

             $scope.availableDateRooms = function ($event) {
                $event.preventDefault();

                $scope.rooms = [];

                rentalService.getAvailableDate(
                  time.getDate(),
                  time.filterDate($scope.data.departure_date),
                  time.getHour()
                )
                .then(function (rooms) {
                    $scope.data.rooms = extendRoomService.extendRooms(rooms);
                         
                    $state.go('menu.rental.room_date', {dataTransition: {
                      rooms: $scope.data.rooms,
                      departure_date: $scope.data.departure_date,
                      client: $scope.client
                    }});
                })
                .catch(function (err) {
                    if(err.status == 400) {
                       showMessage.error(err.data.message);
                    }
                })
            }
        }
    ])

   .controller('clientRentalHour', [
      '$scope',
      '$state',
      '$stateParams',
      'showMessage',
      'time',
      'extendRoomService',
      'rentalService',
      'settingService',
      'clientService',

      function (
        $scope,
        $state,
        $stateParams,
        showMessage,
        time,
        extendRoomService,
        rentalService,
        settingService,
        clientService
      ) {   
           $scope.loading = false;
           $scope.notFound = false;
           $scope.data = {};
           $scope.data.arrival_date = time.getDate();

           clientService.findClient($stateParams.id)
           .then(function (client) {
               $scope.client = client;
                   
               return settingService.getSetting();
            })
            .then(function (setting) {
               $scope.loading = true;
               $scope.setting = setting;
            })
            .catch(function (err) {
               if(err.status == 404) {
                  $scope.loading = true;
                  $scope.notFound = true;
               }
            })

           $scope.availableHourRooms = function ($event) {
              $event.preventDefault();
              
              var currentTime = time.getHour();

              var endTime = time.getEndTime(
                 currentTime,
                 $scope.data.departure_time,
                 $scope.setting.time_minimum
              );
                
              $scope.rooms = [];

              rentalService.getAvailableHour(
                $scope.data.arrival_date,
                currentTime,
                endTime
              ).then(function (rooms) {
                 $scope.rooms = extendRoomService.extendRooms(rooms);
                   $state.go('menu.rental.room_hour', {dataTransition: {
                      rooms: $scope.rooms,
                      client: $scope.client,
                      arrival_date: $scope.data.arrival_date,
                      departure_time: time.setTime($scope.data.departure_time)
                   }})
                })
                .catch(function (err) {
                    showMessage.error(err.data.message);
                })
             }
      }
    ])

    .controller('clientReservationDate', [
       '$scope',
       '$state',
       '$stateParams',
       'showMessage',
       'time',
       'extendRoomService',
       'rentalService',
       'clientService',

       function(
         $scope,
         $state,
         $stateParams,
         showMessage,
         time,
         extendRoomService,
         rentalService,
         clientService
       ) {
            $scope.loading = false;
            $scope.notFound = false;
            $scope.data = {};

            clientService.findClient($stateParams.id)
            .then(function (client) {
                $scope.loading = true;
                $scope.client = client;
            })
            .catch(function (err) {
                $scope.loading = true;
                $scope.notFound = true;
            });

            $scope.availableDateReservationRoom = function ($event) {
                $event.preventDefault();

                $scope.data.arrival_time = time.setTime($scope.data.time);
                $scope.rooms = [];

                rentalService.getAvailableDate(
                  time.filterDate($scope.data.arrival_date),
                  time.filterDate($scope.data.departure_date),
                  $scope.data.arrival_time
                )
                .then(function(rooms) {
                   $scope.rooms = extendRoomService.extendRooms(rooms);
                    
                   $state.go('menu.rental.room_reservation_date', {dataTransition: {
                      arrival_time: $scope.data.arrival_time,
                      arrival_date: $scope.data.arrival_date,
                      departure_date: $scope.data.departure_date,
                      state: $scope.data.state,
                      rooms: $scope.rooms,
                      client: $scope.client
                    }})

                })
                .catch(function (err) {
                    showMessage.error(err.data.message);
                })
            }
       }
    ])

   .controller('clientReservationHour', [
      '$scope',
      '$state',
      '$stateParams',
      'showMessage',
      'time',
      'extendRoomService',
      'rentalService',
      'settingService',
      'clientService',

      function (
        $scope,
        $state,
        $stateParams,
        showMessage,
        time,
        extendRoomService,
        rentalService,
        settingService,
        clientService
      ) {
           $scope.loading = false;
           $scope.notFound = false;
           $scope.data = {};

           clientService.findClient($stateParams.id)
           .then(function (client) {
               $scope.client = client;
                   
               return settingService.getSetting();
            })
            .then(function (setting) {
               $scope.loading = true;
               $scope.setting = setting;
            })
            .catch(function (err) {
               if(err.status == 404) {
                  $scope.loading = true;
                  $scope.notFound = true;
               }
            });

            $scope.availableHourReservationRoom = function ($event) {
                $event.preventDefault();
                
                $scope.data.arrival_time = time.setTime($scope.data.time);
                $scope.data.arrival_date = time.filterDate($scope.data.start_date);
              
                var endTime = time.getEndTime(
                   $scope.data.arrival_time,
                   $scope.data.departure_time,
                   $scope.setting.time_minimum
                );

                $scope.rooms = [];

                rentalService.getAvailableHour(
                    $scope.data.arrival_date,         
                    $scope.data.arrival_time,
                    endTime
                )
                .then(function (rooms) {
                  $scope.rooms = extendRoomService.extendRooms(rooms);

                  $state.go('menu.rental.room_reservation_hour', {dataTransition: {
                     arrival_time: $scope.data.arrival_time,
                     arrival_date: $scope.data.arrival_date,
                     departure_time: time.setTime($scope.data.departure_time),
                     state: $scope.data.state,
                     rooms: $scope.rooms,
                     client: $scope.client
                  }})
                })
                .catch(function (err) {
                    showMessage.error(err.data.message);
                })
            }      
        }
    ])

})(_, alertify)