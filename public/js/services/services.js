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
          } else {
              errors = '"' + errors + '"';
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

    .factory('time', ['$filter', function ($filter) {

        function getHour() {
           var time = new Date();
           var hour = time.getHours();
           var min = time.getMinutes() + 2;
           var totalTime = hour + ':' + min + ':00';

           return totalTime;
        }

        function getDate() {
           return filterDate(Date.now());
        }

        function getDay() {
            var time = new Date();
            var day = time.getDate();

            return day;
        }

        function getMonth() {
            var time = new Date();
            var month = time.getMonth();

            if(month < 10){
               month = '0'+ month;
            }

            return month;
        }

        function getYear() {
            var time = new Date();
            return time.getFullYear();
        }

        function getDayAfter() {
            var day = getDay();
            var month = getMonth();
            var year = getYear();
            
            day = day + 1;

            if(day < 10){
                day ='0'+ day
            }

            return new Date(year, month, day)
        }

        function filterDate($date) {
            return $filter('date')($date, 'yyyy-MM-dd');
        }

        return {
          getHour: getHour,
          getDate: getDate,
          getDayAfter: getDayAfter,
          filterDate: filterDate
        }
    }])

})(_)