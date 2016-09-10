(function () {
    angular.module('castor.services')

    .factory('userService', ['$http', '$q', 'Backend',
      function ($http, $q, Backend) {
        function findUser(userId) {
            var deferred = $q.defer();

            $http.get(Backend.url + 'users/' + userId).then(function (res) {
                deferred.resolve(res.data);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function store(user) {
            var deferred = $q.defer();

            $http.post(Backend.url + 'users', user).then(function (res) {
                deferred.resolve(res.data);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function update(user) {
            var deferred = $q.defer();

            $http.put(Backend.url + 'users/' + user.id, user).then(function (res) {
                deferred.resolve(res.data);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function getUsers() {
            var deferred = $q.defer();

            $http.get(Backend.url + 'users').then(function (res) {
                deferred.resolve(res.data);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function loadRoles(users) {
            var usersWithRole = _.map(users, function(user) {
               var role = 'Administrador';
                
               if(user.role == 2) {
                  role = "Usuario"
               }

              return _.extend({}, user, {display_role: role});
            });

            return usersWithRole;
        }

        return {
          findUser: findUser,
          store: store,
          update: update,
          getUsers: getUsers,
          loadRoles: loadRoles
        }
      }
    ])
})();