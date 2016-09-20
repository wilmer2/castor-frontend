(function () {
    angular.module('castor.services')

    .factory('authService', ['$http', '$q', '$state', '$rootScope', 'Backend', 
       function ($http, $q, $state , $rootScope, Backend) {
          var currentUser = {};

          function setUser(user) {
            currentUser = user;
            $rootScope.loggedIn = true;
          }

          function getUser() {
            var deferred = $q.defer();

            if($rootScope.loggedIn) {
                deferred.resolve(currentUser);
            } else {
                $http.get(Backend.url + 'users/logged')
                .then(function (res) {
                    setUser(res.data);

                    deferred.resolve(currentUser);
                }, function (err) {
                    deferred.reject(err);
                })
            }

            return deferred.promise;
          }

          function cleanUser() {
            currentUser = {};
            $rootScope.loggedIn = false;
          }

          function login(credentials) {
            var deferred = $q.defer();

            $http.post(Backend.url + 'login', credentials)
            .then(function (res) {
                setUser(res.data);
                
                deferred.resolve(res.data);
            }, function (err) {
                deferred.reject(err);
            })

            return deferred.promise;

          }

          function logout() {
            var deferred = $q.defer();

            $http.post(Backend.url +  'logout')
            .then(function (res) {
                deferred.resolve();
            });

            return deferred.promise;
          }

          return {
            cleanUser: cleanUser,
            getUser: getUser,
            setUser: setUser,
            login: login,
            logout: logout
          }
       }
    ])
})()