(function () {
    angular.module('castor.services')

    .factory('time', ['$filter', 'showMessage', function ($filter, showMessage) {
        var errors = [];

        function clearErrors () {
            errors = [];
        }

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
            var totalTime = addedTime.toString();
            var currentTime = this.setTime(hour);
            var splitCurrentTime = currentTime.split(':');

            totalTime += ':' + splitCurrentTime[1] + ':' + splitCurrentTime[2];

            return totalTime;
        }

        function validDateTime(data) {
            if(data.arrival_date == null || data.arrival_date == '') {
                errors.push('La fecha es obligatoria');
            }

            if(data.arrival_time == null || data.arrival_time == '') {
                errors.push('La hora de llegada es obligatoria');
            }

            if(errors.length > 0) {
                showMessage.error(errors);
                this.clearErrors();

                return false;
            }

            return true;
        }

        function validDepartue(data) {
            var valid = true;

            if(data.departure_date == null || data.departure_date == '') {
                valid = false;

                errors.push('La fecha de salida es obligatoria');
            }

            var valid = this.validDateTime(data);

            return valid;
        }

        function getEndTime (fromTime, timeClose, minimumTime) {
            var fromTimeFormat = this.formatTime(fromTime);
            var endTime = this.setTime(timeClose);

            if(endTime == null) {
                endTime = this.sumHours(fromTimeFormat, minimumTime);
            }

            return endTime;
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
          validDateTime: validDateTime,
          validDepartue: validDepartue,
          clearErrors: clearErrors
        }
    }])
})();