(function () {
    'use strict';

    angular
        .module('app')
        .config(function($routeProvider, $locationProvider, $httpProvider, $httpParamSerializerProvider) {
				// get the serializer from the provider
				var paramSerializer = $httpParamSerializerProvider.$get();
				/*console.log(paramSerializer({
					a : 1
				})); // test it
				 */
				$routeProvider.when('/', {
					templateUrl : function(params) {
						// you can use paramSerializer(here
					}
				});
			})
        .factory('UserService', UserService);

    UserService.$inject = ['$http', '$httpParamSerializer'];
    function UserService($http, $httpParamSerializer) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user) {
        	var req = {
    				method : 'POST',
    				url : "user/registration",
    				headers : {
    					"Content-type" : "application/x-www-form-urlencoded; charset=utf-8"
    				},
    				data : $httpParamSerializer(user)
    			}
        	
        	$http(req)
			.then(
					function(data) {
						return data;
						
					},
					function(err) {
						return error;
					}
			);
        	
            //return $http.post('/user/registration', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return res;//.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
