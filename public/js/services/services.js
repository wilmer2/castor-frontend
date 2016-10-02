(function () {
    angular.module('castor.services', [])

    .factory('Backend', function () {
        return {
          url: 'http://castor_backend/'
        };
    })

    .factory('showMessage', [function () {
        function success(message) {
           alertify.success(message);
        }

        function error(errors) {
          if(_.isArray(errors)) {
              errors = formatErrors(errors);
          } else {
              errors = '"' + errors + '"';
          }

          alertify.error(errors);
        }

        function formatErrors(errors) {
          var errorMessage = '';

          _.each(errors, function (error) {
              errorMessage +=  '"' +  error + '"' + ' <br />';
          })

          return errorMessage
        }

        return {
          success: success,
          error: error
        };
    }])

    .factory('extraMime', function () {

        function getMime(source) {
           var segment = source.split('/');
           var path = segment[1].split(';');
           var mime = path[0];

           return mime;
        }

        return {
          getMime: getMime
        }
    })

})(_, alertify)