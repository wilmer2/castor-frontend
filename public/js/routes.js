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
         .state('menu.rental.create', {
            url: "/create",
            templateUrl: "/views/rentals/create-rental.html",
            controller: "rentalCreate"
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