(function () {
    angular.module('castor.filters', [])
    .filter('normalizeTime', ['time', function (time) {
        return function (element) {
          var standar = element.split(':');
          var hourStand = standar[0];

          if(hourStand < 12) {
             hourStand = hourStand + ':' + standar[1] + 'am';
          } else {
             if(hourStand >= 13) {
               hourStand = hourStand - 12;              
               hourStand = time.oneDigit(hourStand);
             }

             hourStand = hourStand + ':' + standar[1] + 'pm';
         }

         return hourStand;
       }
    }])
})()