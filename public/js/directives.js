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

                      element.val('');
                   }

                   scope.$apply();
              })
          }
        }
     }])

    .directive('panelRoom', function () {
        return {
          restrict: 'E',
          templateUrl: '/partials/panel-room.html'
        }
    })

    .directive('entryRoom', function () {
        return {
          restrict: 'E',
          templateUrl: '/partials/entry-room.html'
        }
    })

    .directive('selectRenovate', function () {
        return {
          restrict: 'E',
          templateUrl: '/partials/select-renovate.html'
        }
    })

    .directive('staticRoom', function () {
        return {
          restrict: 'E',
          templateUrl: '/partials/panel-static-room.html'
        }
    })
       
})();
