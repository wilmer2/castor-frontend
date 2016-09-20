(function () {
    angular.module('castor.services', [])

    .factory('Backend', function () {
        return {
          url: 'http://castor_backend/'
        };
    })

    .factory('showMessage', ['toaster', function (toaster) {
        function success(message) {
           /*toaster.clear();

           toaster.pop({
            type: 'success',
            body: '<strong>' + message + '</strong>',
            showCloseButton: true,
            bodyOutputType: 'trustedHtml'
         });*/
           alertify.success(message);
        }

        function error(errors) {
          toaster.clear();

          if(_.isArray(errors)) {
              errors = formatErrors(errors);
          } else {
              errors = '"' + errors + '"';
          }

          /*toaster.pop({
            type: 'error',
            body: errors,
            showCloseButton: true,
            bodyOutputType: 'trustedHtml'
          });*/
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