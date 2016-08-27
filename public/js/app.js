(function () {
  console.log('load app');
    var app = angular.module('castor', [
      'ngAnimate',
      'toaster',
      'ui.router',
      'ui.bootstrap',
      'xeditable',
      'castor.routes',
      'castor.controllers',
      'castor.services',
      'castor.directives'
    ])

})();