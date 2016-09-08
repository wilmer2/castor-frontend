(function () {
   angular.module('castor.controllers')

   .controller('typeShow', [
      '$scope', 
      '$state', 
      '$stateParams', 
      'showMessage',
      'typeService',

       function ($scope, $state, $stateParams, showMessage, typeService) {
          $scope.loading = false;
          $scope.notFound = false;

          typeService.findType($stateParams.id)
          .then(function (type) {
              $scope.loading = true;
              $scope.type = type;
          })
          .catch(function (err) {
              if(err.status == 404) {
                  $scope.loading = true;
                  $scope.notFound = true;
              }
          })

          $scope.edit = function () {
              $state.go('menu.type.edit', {id: $scope.type.id});
          }

          $scope.delete = function () {
              typeService.deleteType($scope.type.id)
              .then(function (res) {
                 showMessage.success(res.message);
                 $state.go('menu.type.list');
              })
              .catch(function (err) {
                 if(err.status == 404) {
                    showMessage.error('Tipo no encontrado');
                    $state.go('menu.type.list');

                 } else if (err. status == 400) {
                    showMessage.error(err.data.message);
                 }
              })
          }

          $scope.confirmDelete = function () {
            var message = "Esta seguro de eliminar tipo";

            alertify.confirm(message, $scope.delete)
            .setting({
              'title': 'Eliminar Tipo',
              'labels': {
                'ok': 'Confirmar',
                'cancel': 'Cancelar'
              }
            });
          }
        }
    ])

   .controller('typeCreate', ['$scope', '$state', 'showMessage', 'typeService',
       function ($scope, $state, showMessage, typeService) {
          $scope.type = {
            file: '',
            mime: ''
          }

          $scope.typeStore = function ($event) {
              $event.preventDefault();

              typeService.store($scope.type)
              .then(function (type) {
                  showMessage.success('El tipo ha sido registrado');
                  $state.go('menu.type.show', {id: type.id});
              })
              .catch(function (err) {
                  showMessage.error(err.data.message);
              })
          }
       }
    ])

   .controller('typeEdit', [
      '$scope', 
      '$state', 
      '$stateParams', 
      'showMessage', 
      'typeService',

      function ($scope, $state, $stateParams, showMessage, typeService) {
          $scope.loading = false;
          $scope.notFound = false;

          typeService.findType($stateParams.id)
          .then(function (type) {
              $scope.loading = true;
              $scope.type = type;
              $scope.type.file = '';
              $scope.type.mime = '';
          })
          .catch(function (err) {
              if(err.status == 404) {
                  $scope.loading = true;
                  $scope.notFound = true;
              }
          })

          $scope.typeUpdate = function ($event) {
              $event.preventDefault();

              typeService.update($scope.type)
              .then(function (type) {
                  showMessage.success('Tipo Actualizado');
                  $state.go('menu.type.show', {id: type.id});
                  
              })
              .catch(function (err) {
                  showMessage.error(err.data.message);
              })
          }
      }
    ])

    .controller('typeList', [
        '$scope', 
        '$state', 
        'DTOptionsBuilder', 
        'typeService',
        'settingService',

        function ($scope, $state, DTOptionsBuilder, typeService, settingService) {
            $scope.types = [];

            $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withLanguage(settingService.getSettingTable())
            .withDOM('ftp')
            .withBootstrap();

            typeService.getTypes()
             .then(function (types) {
                 $scope.types = types;
             })
             .catch(function (err) {
                 console.log(err);
             });

             $scope.show = function (typeId) {
                $state.go('menu.type.show', {id: typeId});
             }

        }
    ])

})(alertify);


