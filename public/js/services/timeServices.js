(function () {
    angular.module('castor.services')

    .factory('time', ['$filter', 'showMessage', function ($filter, showMessage) {
        function getHour() {
           var time = new Date();
           var hour = time.getHours();
           var min = time.getMinutes() + 1;
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
            if(date == null || date == '') {
                return null;
            } else {
                var splitDate = date.split('-');
                var formatDate = new Date(splitDate[0], splitDate[1]-1, splitDate[2]);
                
                return formatDate;
            }
        }

        function formatTime(time) {
            if(time == null || time == '') {
                return null;
            } else {
                var splitTime = time.split(':');
                var formatTime = new Date(1970, 0, 1, splitTime[0], splitTime[1], splitTime[2]);
                
                return formatTime;
            }
        }

        function setTime(time) {
            if(time == null || time == '') {
                return null;
            } else {
                var timeFormat = time.toString();
                var splitSendTime = timeFormat.split(' ');
            
                return splitSendTime[4];
            }
        }

        function sumHours(hour, extraHour) {
            var splitExtraTime = extraHour.split(':');
            var sumTime =  parseInt(splitExtraTime[0]);
            var addedTime = hour.getHours() + sumTime; 

            if(addedTime >= 24) {
                addedTime -= 24;
            }

            var totalTime = this.oneDigit(addedTime);
            var currentTime = this.setTime(hour);
            var splitCurrentTime = currentTime.split(':');

            totalTime += ':' + splitCurrentTime[1] + ':' + splitCurrentTime[2];

            return totalTime;
        }

        function getEndTime (fromTime,timeClose, minimumTime) {
            var endTime = this.setTime(timeClose);
            var formatTime = this.formatTime(fromTime);
            
            if(endTime == null) {
                endTime = this.sumHours(formatTime, minimumTime);
            }

            return endTime;
        }

        function oneDigit(timeStand) {
            var timeDigit;
            if(timeStand < 10) {
               timeDigit = '0' + timeStand;
            } else {
                timeDigit = timeStand.toString();
            }

            return timeDigit;
        }

        return {
          getHour: getHour,
          getDate: getDate,
          getEndTime: getEndTime,
          getDayAfter: getDayAfter,
          filterDate: filterDate,
          formatDate: formatDate,
          formatTime: formatTime,
          setTime: setTime,
          sumHours: sumHours,
          oneDigit: oneDigit
        }
    }])
})();