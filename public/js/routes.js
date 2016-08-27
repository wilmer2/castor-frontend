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
         .state('menu.type', {
            url: "/type",
            templateUrl: "/views/types"
         })
         .state('menu.type.create', {
            url: "/create",
            templateUrl: "/views/types/typeNew.html",
            controller: "TypeCreate"
         })
         .state('menu.rental', {
            url : "/rental",
            templateUrl: "/views/rentals"
         })
         /*.state('menu.rental.create', {
            url: "/create/:id",
            templateUrl: "/views/rentals/create-rental.html",
            controller: "rentalCreate",
            params: {
             id: null
            }
         })*/
         .state('menu.rental.renovate_date', {
            url: "/{id}/renovate-date",
            templateUrl: "/views/rentals/renovate-date.html",
            controller: 'renovateDate'
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
         })
         .state('menu.client', {
            url: "/client",
            templateUrl: "/views/clients"
         })
         .state('menu.client.show', {
            url: "/{id}",
            templateUrl: "/views/clients/show.html",
            controller: "clientShow"
         })
         
    }]);

})();