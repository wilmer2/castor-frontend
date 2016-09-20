(function () {
    angular.module('castor.directives', [])
     .directive('uploadImg', ['extraMime', function (extraMime) {
        return {
          link: function (scope, element) {
              element.on('change', function (e) {
                  var file = e.target.files[0];
                  var imageType = /image.*/;

                   if(file.type.match(imageType)) {
                      var reader = new FileReader();

                      reader.onloadend = function (e) {
                          var source = e.target.result;
                          var mime =  extraMime.getMime(source);
                          
                          scope.type.file = source;
                          scope.type.mime = mime;
                      }

                      reader.readAsDataURL(file);
                   } else {
                      scope.type.file = '';
                      scope.type.mime = '';

                      alertify.error('Formato de imagen no valido');

                      element.val('');
                   }

                   scope.$apply();
              })
          }
        }
     }])

    .directive('convertToNumber', function() {
        return {
          require: 'ngModel',

          link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(val) {
            return parseInt(val, 10);
          });

          ngModel.$formatters.push(function(val) {
            return '' + val;
          });
        }
     };
    })

    .directive('selectRoom', function () {
        return {
          restrict: 'E',
          templateUrl: '/partials/select-room.html'
        }
    })

    .directive('entryRoom', function () {
        return {
          restrict: 'E',
          templateUrl: '/partials/entry-rental.html'
        }
    })

    .directive('selectRenovate', function () {
        return {
          restrict: 'E',
          templateUrl: '/partials/select-renovate.html'
        }
    })

    .directive('btnRental', function () {
        return {
          restrict: 'E',
          templateUrl: '/partials/btn-rental-edit.html'
        }
    })

    .directive('btnCreate', function () {
        return {
          restrict: 'E',
          templateUrl: '/partials/btn-create.html'
        }
    })

    .directive('btnAdd', function () {
        return {
          restrict: 'E',
          templateUrl: '/partials/btn-rental-add.html'
        }
    })
    
    .directive('countRental', function () {
        return {
          restrict: 'E',
          templateUrl: '/partials/count-rental.html'
        }
    })

    .directive('menuClient', function () {
        return {
          restrict: 'E',
          templateUrl: '/partials/menu-client.html'
        }
    })

    .directive('formClient', function () {
        return {
          restrict: 'E',
          templateUrl: '/partials/form-client.html'
        }
    })

    .directive('formRecord', function () {
        return {
          restrict: 'E',
          templateUrl: '/partials/form-record.html'
        }
    })
 
})(alertify);
