(function () {
  console.log('load app');
    var app = angular.module('castor', [
      'ngAnimate',
      'datatables',
      'datatables.bootstrap',
      'toaster',
      'ui.router',
      'ui.bootstrap',
      'castor.routes',
      'castor.controllers',
      'castor.services',
      'castor.directives'
    ])

    app.run(function ($rootScope, $state, authService, showMessage) {
        
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

})();