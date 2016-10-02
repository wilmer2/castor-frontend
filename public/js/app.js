(function () {
    var app = angular.module('castor', [
      'ngAnimate',
      'datatables',
      'datatables.bootstrap',
      'ui.router',
      'ui.bootstrap',
      'castor.routes',
      'castor.controllers',
      'castor.services',
      'castor.filters',
      'castor.directives'
    ])

    app.run(function ($rootScope, $state, authService, showMessage) {
       alertify.defaults.theme.ok = "btn btn-primary";
       alertify.defaults.theme.cancel = "btn btn-danger";
        
       $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
          if(toState.authenticate) {
             authService.getUser()
             .then(function (user) {
                var currentUser = user;

                if(toState.isAdmin && currentUser.role == 2) {
                    showMessage.error('Usuario no tiene permisos');
                    $state.go('menu.rental.list');
                }
             })
             .catch(function (err) {
                if(err.status == 401) {
                    showMessage.error('Usuario no logueado');
                    $state.go('login');
                }
             })             
          }
       })
    })

})(alertify);