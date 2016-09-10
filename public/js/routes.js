
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
            controller: "login"
         })
         .state('menu', {
            url: "/app",
            templateUrl: "/views/home/menu.html"
         })
         .state('menu.client', {
            url: "/client",
            templateUrl: "/views/clients"
         })
         .state('menu.client.list', {
            url: "/list",
            templateUrl: "views/clients/list.html",
            controller: "clientList"
         })
         .state('menu.client.create', {
            url:"/create",
            templateUrl: "views/clients/create.html",
            controller: "clientCreate"
         })
         .state('menu.client.show', {
            url: "/{id}",
            templateUrl: "/views/clients/show.html",
            controller: "clientShow"
         })
         .state('menu.client.edit', {
            url: "/{id}/edit",
            templateUrl: "/views/clients/edit.html",
            controller: "clientEdit"
         })
         .state('menu.client.rental', {
            url: "/{id}/rentals",
            templateUrl: "/views/clients/rentals.html",
            controller: "clientRentals"
         })
         .state('menu.client.reservation', {
            url: "/{id}/reservations",
            templateUrl: "/views/clients/reservations.html",
            controller: "clientReservations"
         })
         .state('menu.type', {
            url: "/type",
            templateUrl: "/views/types"
         })
         .state('menu.type.list', {
            url: "/list",
            templateUrl: "/views/types/list.html",
            controller: "typeList"
         })
         .state('menu.type.create', {
            url: "/create",
            templateUrl: "/views/types/create.html",
            controller: "typeCreate"
         })
         .state('menu.type.show', {
            url: "/{id}",
            templateUrl: "/views/types/show.html",
            controller: "typeShow"
         })
         .state('menu.type.edit', {
            url:"/{id}/edit",
            templateUrl: "/views/types/edit.html",
            controller: "typeEdit"
         })
         .state('menu.room', {
            url: "/room",
            templateUrl: "/views/rooms"
         })
         .state('menu.room.create', {
            url:"/create",
            templateUrl: "/views/rooms/create.html",
            controller: "roomCreate"
         })
         .state('menu.room.list', {
            url: "/list",
            templateUrl: "/views/rooms/list.html",
            controller: "roomList"
         })
         .state('menu.room.maintenance', {
            url: "/list/maintenance",
            templateUrl: "views/rooms/list-maintenance.html",
            controller: "roomMaintenance"
         })
         .state('menu.room.disabled', {
            url: "/list/disabled",
            templateUrl: "views/rooms/list-disabled.html",
            controller: "roomDisabled"
         })
         .state('menu.room.show', {
            url: "/{id}",
            templateUrl: "/views/rooms/show.html",
            controller: "roomShow"
         })
         .state('menu.room.edit', {
            url: "/{id}/edit",
            templateUrl: "/views/rooms/edit.html",
            controller: "roomEdit"
         })

         /*.state('menu.rental', {
            url : "/rental",
            templateUrl: "/views/rentals"
         })
         .state('menu.rental.create_date', {
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