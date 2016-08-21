(function () {

  angular.module('castor.routes', [])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");

        $stateProvider
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
    }]);

})();