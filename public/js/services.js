(function () {
    angular.module('castor.services', [])

    .factory('Backend', function () {
        return {
          url: 'http://castor_backend/'
        };
    })

    .factory('showMessage', ['toaster', function (toaster) {

        function success(message) {
           toaster.clear();

           toaster.pop({
            type: 'success',
            body: '<strong>' + message + '</strong>',
            showCloseButton: true,
            bodyOutputType: 'trustedHtml'
         });
        }

        function error(errors) {
          toaster.clear();

          if(_.isArray(errors)) {
            errors = formatErrors(errors);
          }

          toaster.pop({
            type: 'error',
            title: '"' + 'Error en solicitud' + '"',
            body: errors,
            showCloseButton: true,
            bodyOutputType: 'trustedHtml'
          });
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


})(_)