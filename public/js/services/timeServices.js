(function () {
    angular.module('castor.services')

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

        function filterDate(date) {
            return $filter('date')(date, 'yyyy-MM-dd');
        }

        function formatDate(date) {
            var splitDate = date.split('-');
            var formatDate = new Date(splitDate[0], splitDate[1]-1, splitDate[2]);

            return formatDate;
        }

        function formatTime(time) {
            var splitTime = time.split(':');
            var formatTime = new Date(1970, 0, 1, splitTime[0], splitTime[1], splitTime[2]);

            return formatTime;
        }

        function setTime(time) {
            var timeFormat = time.toString();
            var splitSendTime = timeFormat.split(' ');
            
            return splitSendTime[4];
        }

        return {
          getHour: getHour,
          getDate: getDate,
          getDayAfter: getDayAfter,
          filterDate: filterDate,
          formatDate: formatDate,
          formatTime: formatTime,
          setTime: setTime
        }
    }])
})();