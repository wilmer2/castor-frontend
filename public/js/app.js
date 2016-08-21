(function () {
  console.log('load app');
    var app = angular.module('castor', [
      'ngAnimate',
      'toaster',
      'ui.router',
      'castor.routes',
      'castor.controllers',
      'castor.services'
    ])

})();