
(function () {

  angular.module('castor.routes', [])
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider' ,
      function ($stateProvider, $urlRouterProvider, $httpProvider) {

        $httpProvider.defaults.withCredentials = true;
        $urlRouterProvider.otherwise("/");

        $stateProvider
         .state('login', {
            url: "/",
            templateUrl: "/views/login",
            controller: "login",
            authenticate: false,
            isAdmin: false
         })
         .state('print', {
            url: "/rental/print",
            templateUrl: "views/rentals/rental-print.html",
            controller: "rentalPrint",
            params: {
               dataTransition: null
            },
            authenticate: false,
            isAdmin: false
         })
         .state('menu', {
            url: "/app",
            templateUrl: "/views/home/menu.html",
            controller: "auth"
         })
         .state('menu.client', {
            url: "/client",
            templateUrl: "/views/clients",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.client.list', {
            url: "/list",
            templateUrl: "views/clients/list.html",
            controller: "clientList",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.client.create', {
            url:"/create",
            templateUrl: "views/clients/create.html",
            controller: "clientCreate",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.client.show', {
            url: "/{id}",
            templateUrl: "/views/clients/show.html",
            controller: "clientShow",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.client.edit', {
            url: "/{id}/edit",
            templateUrl: "/views/clients/edit.html",
            controller: "clientEdit",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.client.rental', {
            url: "/{id}/rentals",
            templateUrl: "/views/clients/rentals.html",
            controller: "clientRentals",
            authenticate: true,
            isAdmin: false

         })
         .state('menu.client.rental_date', {
            url: "/{id}/rentals/date",
            templateUrl: "/views/clients/create-rental-date.html",
            controller: "clientRentalDate",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.client.rental_hour', {
            url: "/{id}/rentals/hour",
            templateUrl: "/views/clients/create-rental-hour.html",
            controller: "clientRentalHour",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.client.reservation', {
            url: "/{id}/reservations",
            templateUrl: "/views/clients/reservations.html",
            controller: "clientReservations",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.client.reservation_date', {
            url: "/{id}/reservations-date",
            templateUrl: "/views/clients/create-reservation-date.html",
            controller: "clientReservationDate",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.client.reservation_hour', {
            url: "/{id}/reservations-hour",
            templateUrl: "/views/clients/create-reservation-hour.html",
            controller: "clientReservationHour",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.type', {
            url: "/type",
            templateUrl: "/views/types",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.type.list', {
            url: "/list",
            templateUrl: "/views/types/list.html",
            controller: "typeList",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.type.create', {
            url: "/create",
            templateUrl: "/views/types/create.html",
            controller: "typeCreate",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.type.show', {
            url: "/{id}",
            templateUrl: "/views/types/show.html",
            controller: "typeShow",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.type.edit', {
            url:"/{id}/edit",
            templateUrl: "/views/types/edit.html",
            controller: "typeEdit",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.room', {
            url: "/room",
            templateUrl: "/views/rooms",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.room.create', {
            url:"/create",
            templateUrl: "/views/rooms/create.html",
            controller: "roomCreate",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.room.list', {
            url: "/list",
            templateUrl: "/views/rooms/list.html",
            controller: "roomList",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.room.maintenance', {
            url: "/list/maintenance",
            templateUrl: "views/rooms/list-maintenance.html",
            controller: "roomMaintenance",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.room.disabled', {
            url: "/list/disabled",
            templateUrl: "views/rooms/list-disabled.html",
            controller: "roomDisabled",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.room.show', {
            url: "/{id}",
            templateUrl: "/views/rooms/show.html",
            controller: "roomShow",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.room.edit', {
            url: "/{id}/edit",
            templateUrl: "/views/rooms/edit.html",
            controller: "roomEdit",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.user', {
            url: "/user",
            templateUrl: "views/users",
            authenticate: true,
            isAdmin: true,
         })
         .state('menu.user.create', {
            url: "/create",
            templateUrl: "/views/users/create.html",
            controller: "userCreate",
            authenticate: true,
            isAdmin: true
         })
         .state('menu.user.list', {
            url: "/list",
            templateUrl: "/views/users/list.html",
            controller: "userList",
            authenticate: true,
            isAdmin: true
         })
         .state('menu.user.edit', {
            url: "/{id}/edit",
            templateUrl: "/views/users/edit.html",
            controller: "userEdit",
            authenticate: true,
            isAdmin: true
         })
         .state('menu.rental', {
            url: "/rental",
            templateUrl: "/views/rentals",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.list', {
            url: "/list",
            templateUrl: "/views/rentals/list.html",
            controller: "rentalList",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.reservation', {
            url: "/reservations",
            templateUrl: "/views/rentals/list-reservation.html",
            controller: "reservationList",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.reservation_pending', {
            url: "/reservations/pending",
            templateUrl: "/views/rentals/list-reservation-pending.html",
            controller: "reservationPending",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.show', {
            url: "/{id}",
            templateUrl: "/views/rentals/show.html",
            controller: "rentalShow",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.date', {
            url:  "/create/date",
            templateUrl: "/views/rentals/create-rental-date.html",
            controller: "rentalCreateDate",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.hour', {
            url: "/create/hour",
            templateUrl: "/views/rentals/create-rental-hour.html",
            controller: "rentalCreateHour",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.reservation_date', {
            url: "/create/reservation-date",
            templateUrl: "/views/rentals/create-reservation-date.html",
            controller: "reservationDateCreate",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.reservation_hour', {
            url: "/create/reservation-hour",
            templateUrl: "/views/rentals/create-reservation-hour.html",
            controller: "reservationHourCreate",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.reservation_date_edit', {
            url: "/{id}/edit/reservation-date",
            templateUrl: "/views/rentals/edit-reservation-date.html",
            controller: "reservationDateEdit",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.reservation_hour_edit', {
            url: "/{id}/edit/reservation-hour",
            templateUrl: "/views/rentals/edit-reservation-hour.html",
            controller: "reservationHourEdit",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.room_renovate_date', {
            url: "/room/renovate-date",
            templateUrl: "/views/rentals/rental-edit-rooms.html",
            controller: "renovateDateRooms",
            params: {
               dataTransition: null
            },
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.renovate_date', {
            url: "/{id}/renovate-date",
            templateUrl: "/views/rentals/renovate-date.html",
            controller: "renovateDate",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.renovate_hour', {
            url: "/{id}/renovate-hour",
            templateUrl: "/views/rentals/renovate-hour.html",
            controller: "renovateHour",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.room_renovate_hour', {
            url: "/room/renovate-hour",
            templateUrl: "/views/rentals/rental-edit-rooms.html",
            controller: "renovateHourRoom",
            params: {
               dataTransition: null
            },
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.room_date', {
            url: "/room/date",
            templateUrl: "/views/rentals/rental-rooms.html",
            controller: "rentalDateRoom",
            params: {
               dataTransition: null
            },
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.room_hour', {
            url: "/room/hour",
            templateUrl: "/views/rentals/rental-rooms.html",
            controller: "rentalHourRoom",
            params: {
               dataTransition: null
            },
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.room_reservation_date', {
            url: "/room/reservation-date",
            templateUrl: "views/rentals/rental-rooms.html",
            controller: "reservationDateRoom",
            params: {
               dataTransition: null
            },
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.room_reservation_hour', {
            url: "/room/reservations-hour",
            templateUrl: "views/rentals/rental-rooms.html",
            controller: "reservationHourRoom",
            params: {
               dataTransition: null
            },
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.room_reservation_date_edit', {
            url: "/room/reservation-date-edit",
            templateUrl: "views/rentals/rental-edit-rooms.html",
            controller: "reservationDateEditRoom",
            params: {
               dataTransition: null
            },
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.room_reservation_hour_edit', {
            url: "/room/reservation-hour-edit",
            templateUrl: "views/rentals/rental-edit-rooms.html",
            controller: "reservationHourEditRoom",
            params: {
               dataTransition: null
            },
            authenticate: true,
            isAdmin: false
         })
         .state('menu.record', {
            url: "/record",
            templateUrl: "views/records"
         })
         .state('menu.record.create_step', {
            url: "/create-step",
            templateUrl: "/views/records/record-step.html",
            controller: "recordCreateStep",
            params: {
               dataTransition: null
            },
            authenticate: true,
            isAdmin: false
         })
         .state('menu.record.edit_step', {
            url: "/edit-step",
            templateUrl: "/views/records/record-step.html",
            controller: "RecordEditStep",
            params: {
               dataTransition: null
            },
            authenticate: true,
            isAdmin: false
         })
         .state('menu.record.create', {
            url: "/create",
            templateUrl: "/views/records/register-record.html",
            controller: "recordCreateStep",
            params: {
               dataTransition: null
            },
            authenticate: true,
            isAdmin: false
         })
         .state('menu.record.edit', {
            url: "/edit",
            templateUrl: "/views/records/register-record.html",
            controller: "RecordEditStep",
            params: {
               dataTransition: null
            },
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.add_room_date', {
            url: "/{id}/add-room-date",
            templateUrl: "/views/rentals/add-date.html",
            controller: "addRoomDate",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.add_room_hour', {
            url: "/{id}/add-room-hour",
            templateUrl: "/views/rentals/add-hour.html",
            controller: "addRoomHour",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.rental.room_change', {
            url: "/{id}/room/{roomId}/change",
            templateUrl: "/views/rentals/change-room.html",
            controller: "changeRoom",
            authenticate: true,
            isAdmin: false
         })
         .state('menu.setting', {
            url: "/setting",
            templateUrl: "/views/setting",
            authenticate: true,
            isAdmin: true
         })
         .state('menu.setting.edit', {
            url: "/edit",
            templateUrl: "/views/setting/setting.html",
            controller: "setting",
            authenticate: true,
            isAdmin: true
         })
         .state('menu.move', {
            url: "/move",
            templateUrl: "/views/moves/",
            authenticate: true,
            isAdmin: true
         })
         .state('menu.move.list', {
            url: "/list",
            templateUrl: "/views/moves/list.html",
            controller: "moveController",
            authenticate: true,
            isAdmin: true
         })

         //test

         /*function auth($q, $time, $state, authService) {
            alert('test');
            var deferred = $q.defer();

            console.log('auth login');

            authService.getUser()
            .then(function (res) {
                console.log('test');
               return deferred.resolve();
            }).
            catch(function (err) {
                console.log('error');
              $timeout(function() {
                $state.go('login')
              });

               return deferred.reject();
            })
         }*/
         
         /*.state('menu.rental.create_date', {
            url: "/date/:link/:id",
            templateUrl: "/views/rentals/create-rental-date.html",
            controller: "rentalCreateDate",
            params: {
               link: 'create',
               id: null
            }
         })
         .state('menu.rental.create_hour', {
            url: "/hour/:link/:id",
            templateUrl: "/views/rentals/create-rental-hour.html",
            controller: "rentalCreateHour",
            params: {
               link: 'create',
               id: null
            }
         })
         .state('menu.rental.reservation_hour', {
            url: "/reservation-hour/:link/:id",
            templateUrl: "/views/rentals/create-reservation-hour.html",
            controller: "reservationHourCreate",
            params: {
               link: 'create',
               id: null
            }
         })
         .state('menu.rental.reservation_date', {
            url: "/reservation-date/:link/:id",
            templateUrl: "/views/rentals/create-reservation-date.html",
            controller: "reservationDateCreate",
            params: {
               link: 'create',
               id: null
            }
         })
         .state('menu.rental.room_change', {
            url: "/{id}/room/{roomId}/change",
            templateUrl: "/views/rentals/change-room.html",
            controller: "changeRoom"
         })
         .state('menu.rental.add_room_date', {
            url: "/{id}/add-room-date",
            templateUrl: "/views/rentals/add-date.html",
            controller: "addRoomDate"
         })
         .state('menu.rental.add_room_hour', {
            url: "/{id}/add-room-hour",
            templateUrl: "/views/rentals/add-hour.html",
            controller: "addRoomHour"
         })
         .state('menu.rental.renovate_date', {
            url: "/{id}/renovate-date",
            templateUrl: "/views/rentals/renovate-date.html",
            controller: "renovateDate"
         })
         .state('menu.rental.revenovate_hour', {
            url: "/{id}/renovate-hour",
            templateUrl: "/views/rentals/renovate-hour.html",
            controller: "renovateHour"
         })
         .state('menu.rental.reservation_date_edit', {
            url: "/{id}/reservation-date/edit",
            templateUrl: "/views/rentals/reservation-date-edit.html",
            controller: "reservationDateEdit"
         })
         .state('menu.rental.reservation_hour_edit', {
            url: "/{id}/reservation-hour/edit",
            templateUrl: "/views/rentals/reservation-hour-edit.html",
            controller: "reservationHourEdit"
         })*/
         
    }]);

})();