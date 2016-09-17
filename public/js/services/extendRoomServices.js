(function () {
     angular.module('castor.services')

     .factory('extendRoomService', function () {
         function extendRooms (rooms) {
            var roomsWithSelect = _.map(rooms, function(room) { 
              return _.extend({}, room, {select: false, inmutable:false});
            });

            return roomsWithSelect;
         }

         function previouslySelectedRoom(currentRooms, rooms) {
            var selectedRooms = _.map(rooms, function (room) {

                var selectRoom = _.find(currentRooms, function (currentRoom) {
                    return currentRoom.roomId == room.roomId;
                });

                if(selectRoom != undefined) {
                    room.select = true;
                    room.inmutable = true;
                }

                return room;
            });

            return selectedRooms;
         }

         function findRoom(rooms, roomId) {
            var room = _.find(rooms, function (room) {
                return room.roomId == roomId
            });

            return room;
         }

        
         function addRoom(rooms, room_ids, id) {
            var room = _.find(rooms, function (room) {
                return room.roomId == id
            });

            room.select = true;
            room_ids.push(room.roomId);

            return room_ids;
         }


         function detachRoom(rooms, room_ids, id) {
             var room_ids = _.filter(room_ids, function (roomId) {
                return roomId != id;
             });

             var room = _.find(rooms, function (room) {
                 return room.roomId == id
             });

             room.select = false;

             return room_ids;
         }

          function addPreviouslySelectedRoom(rooms, room_ids) {
            _.each(rooms, function (room) {
                if(room.inmutable) {
                    room_ids = addRoom(rooms, room_ids, room.roomId);
                }
            })

            return room_ids;
         }

         function maxRoom(currentRooms ,rooms) {
             var max = currentRooms.length;

             if(rooms < currentRooms) {
                  max = rooms.length
             }

             return max;
         }

         function countAllRoom(rooms, staticRooms, maxRoom) {
            return rooms.length + staticRooms.length == maxRoom;
         }


         return {
            extendRooms: extendRooms,
            previouslySelectedRoom: previouslySelectedRoom,
            addRoom: addRoom,
            detachRoom: detachRoom,
            addPreviouslySelectedRoom: addPreviouslySelectedRoom,
            maxRoom: maxRoom,
            countAllRoom: countAllRoom,
            findRoom: findRoom
         }
     })


})(_)