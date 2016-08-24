(function () {
  console.log('load app');
    var app = angular.module('castor', [
      'ngAnimate',
      'toaster',
      'ui.router',
      'ui.bootstrap',
      'ngTable',
      'castor.routes',
      'castor.controllers',
      'castor.services',
      'castor.directives'
    ])

})();