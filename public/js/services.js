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

    .factory('clientProfile', ['$http', '$stateParams', 'Backend', 
       function ($http, $stateParams) {
          var clientProfile = null;

          return {
              resolver: function ()  {
                 if(_.isUndefined($stateParams.id) || _.isEmpty($stateParams.id)) {
                    return clientProfile;
                 } else {
                    return $http.get(Backend.url + 'clients/' + $stateParams.id).then(function (res) {
                        clientProfile = res.data;
                    }, function () {
                        return clientProfile;
                    })
                 }
              },

              get() {
                  return clientProfile
              }
          }
    }])

    .factory('time', ['$filter', function ($filter) {
        var time = new Date();

        function getHour() {
           var hour = time.getHours();
           var min = time.getMinutes() + 2;
           var totalTime = hour + ':' + min + ':00';

           return totalTime;
        }

        function getDate() {
           return filterDate(Date.now());
        }

        function getDay() {
            var day = time.getDate();

            return day;
        }

        function getMonth() {
            var month = time.getMonth();

            if(month < 10){
               month = '0'+ month;
            }

            return month;
        }

        function getYear() {
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

   .factory('extendRooms', function () {
       function extendSelectRooms (rooms) {
         var roomsWithSelect = _.map(rooms, function(room) { 
              return _.extend({}, room, {select: false});
         });
         return roomsWithSelect;
       }

       return {
          extendSelectRooms: extendSelectRooms
       }
   })


})(_)