(function () {
   angular.module('castor.controllers')
   
   .controller('roomCreate', [
      '$scope', 
      '$state', 
      'showMessage', 
      'roomService', 
      'typeService',

      function (
        $scope,
        $state,
        showMessage,
        roomService,
        typeService
      ) {  
           $scope.loading = false;
           $scope.room = {};

           typeService.getTypes()
           .then(function (types) {
              $scope.loading = true;
              $scope.types = types;
           });

           $scope.sendData = function ($event) {
              $event.preventDefault();

              roomService.store($scope.room)
              .then(function (room) {
                  showMessage.success('Habitacione registrada');
                  $state.go('menu.room.show', {id: room.id });
              })
              .catch(function (err) {
                  if(err.status == 400) {
                      showMessage.error(err.data.message);
                  }
              })
           }
      }
    ])

   .controller('roomShow', [
      '$scope',
      '$state',
      '$stateParams',
      'showMessage',
      'roomService',

      function (
        $scope,
        $state,
        $stateParams,
        showMessage,
        roomService
      ) {
           $scope.loading = false;
           $scope.notFound = false;

           roomService.findRoom($stateParams.id)
           .then(function (room) {
              $scope.loading = true;
              $scope.room = room;
           })
           .catch(function (err) {
              if(err.status == 404) {
                  $scope.loading = true;
                  $scope.notFound = true;
              }
           })

           $scope.disabledRoom = function () {
              roomService.disabledRoom($scope.room.id)
              .then(function (room) {
                  showMessage.success('Habitacion deshabilitada');
                  $scope.room = room;
              })
              .catch(function (err) {
                  if(err.status == 400) {
                      showMessage.error(err.data.message);
                  } else if(err.status == 404) {
                      showMessage.error('Habitacion no encontrada');
                  }
              })
           }

           $scope.enableRoom = function () {
              roomService.enableRoom($scope.room.id)
              .then(function (room) {
                  showMessage.success('Habitacion habilitada');
                  $scope.room = room;
              })
              .catch(function (err) {
                  if(err.status == 400) {
                      showMessage.error(err.data.message);
                  } else if(err.status == 404) {
                      showMessage.error('Habitacion no encontrada');
                  }
              })
           }

           $scope.edit = function () {
              $state.go('menu.room.edit', {id: $scope.room.id});
           }

           $scope.delete = function () {
              roomService.deleteRoom($scope.room.id)
              .then(function (res) {
                 showMessage.success(res.message);
                 $state.go('menu.room.list');
              })
              .catch(function (err) {
                 if(err.status == 404) {
                    showMessage.error('Tipo no encontrado');
                    $state.go('menu.room.list');

                 } else if (err. status == 400) {
                    showMessage.error(err.data.message);
                 }
              })
          }

          $scope.confirmDelete = function () {
            var message = "Esta seguro de eliminar esta habitacion";

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

    .controller('roomEdit', [
        '$scope',
        '$state',
        '$stateParams',
        'showMessage',
        'roomService',
        'typeService',

        function (
          $scope,
          $state,
          $stateParams,
          showMessage,
          roomService,
          typeService
        ) {
             $scope.loading = false;
             $scope.notFound = false;

             roomService.findRoom($stateParams.id)
             .then(function (room) {
                $scope.room = room;

                return typeService.getTypes();
             })
             .then(function (types) {
                $scope.loading = true;
                $scope.types = types;
            })
            .catch(function (err) {
                if(err.status == 404) {
                    $scope.loading = true;
                    $scope.notFound = true;
                }
            });

            $scope.sendData = function ($event) {
                $event.preventDefault();

                roomService.update($scope.room)
                .then(function (room) {
                    showMessage.success('La habitacion ha sido actualizada')
                    $state.go('menu.room.show', {id: room.id});
                })
                .catch(function (err) {
                   if(err.status == 400) {
                      showMessage.error(err.data.message);
                   }
                })
            }
        }
    ])

    .controller('roomList', [
       '$scope',
       '$state',
       'DTOptionsBuilder',
       'roomService',
       'settingService',

       function (
         $scope,
         $state, 
         DTOptionsBuilder,
         roomService,
         settingService
       ) {  

            $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withLanguage(settingService.getSettingTable())
            .withDOM('ftp')
            .withBootstrap();

            roomService.getRooms()
            .then(function (rooms) {
                $scope.rooms = rooms;
            })
            .catch(function (err) {
                console.log(err);
            });

            $scope.show = function (roomId) {
                $state.go('menu.room.show', {id: roomId});
            }
       }
    ])
})(_, alertify)