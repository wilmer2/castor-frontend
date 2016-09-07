(function () {
    angular.module('castor.services')

    .factory('settingService', ['$http', '$q', 'Backend',
        function ($http, $q, Backend) {
            function getSetting() {
                var deferred = $q.defer();
                
                $http.get(Backend.url + 'setting').then(function (res) {
                    deferred.resolve(res.data);
                });

                return deferred.promise;
            }

            function getSettingTable () {
                var optionTable = {
                    "sEmptyTable":     "No hay data disponible",
                     "sInfo":           "Showing _START_ to _END_ of _TOTAL_ entries",
                     "sInfoEmpty":      "Showing 0 to 0 of 0 entries",
                     "sInfoFiltered":   "(filtered from _MAX_ total entries)",
                     "sInfoPostFix":    "",
                     "sInfoThousands":  ",",
                     "sLengthMenu":     "Show _MENU_ entries",
                     "sLoadingRecords": "Cargando...",
                     "sProcessing":     "Procesando...",
                     "sSearch":         "Buscar:",
                     "sZeroRecords":    "No se encontro datos concidentes",
                     "oPaginate": {
                         "sFirst":    "First",
                         "sLast":     "Last",
                         "sNext":     "Siguiente",
                         "sPrevious": "Atras"
                     },
                     "oAria": {
                         "sSortAscending":  ": activate to sort column ascending",
                         "sSortDescending": ": activate to sort column descending"
                     }         
                };

                return optionTable;
            }

            return {
              getSetting: getSetting,
              getSettingTable: getSettingTable
            }
        
    }])
})();