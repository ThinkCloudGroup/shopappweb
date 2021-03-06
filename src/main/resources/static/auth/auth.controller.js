﻿(function() {
	'use strict';

	angular.module('app')
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
				
			}).controller('AuthController', AuthController);

	AuthController.$inject = [ '$rootScope', '$location',
			'AuthenticationService', 'FlashService', '$http',
			'$httpParamSerializer', '$cookies', '$routeParams' ];
	function AuthController($scope, $location, AuthenticationService,
			FlashService, $http, $httpParamSerializer, $cookies, $routeParams) {
		var ctrl = this;
		
		ctrl.login = login;

		$scope.isLoggedIn = false;

		$scope.loginData = {
			grant_type : "password",
			username : "",
			password : "",
			client_id : "fooClientIdPassword"
		};
		
		var tempParam = {
				grant_type : "password",
				username : "",
				password : "",
				client_id : "fooClientIdPassword"
		}
		
		$scope.refreshData = {
			grant_type : "refresh_token"
		};
		
		if ($routeParams.cleansess) {
			$cookies.remove("access_token");
		}

		var isLoginPage = window.location.href.indexOf("login") != -1;
		if (isLoginPage) {

			if ($cookies.get("access_token")) {
				//$cookies.remove("access_token");			    
				window.location.href = "/shopadmin/tcg";
			}
		} else {
			if ($cookies.get("access_token")) {
				//$http.defaults.headers.common.Authorization= 'Bearer ' + $cookies.get("access_token");
				//getOrganization();
				$scope.isLoggedIn = true;
			} else {
				$scope.isLoggedIn = false;
			}
		}

		(function initController() {
			
			// reset login status
			AuthenticationService.ClearCredentials();
		})();

		function login() {
			ctrl.dataLoading = true;
			
			 
			/*
			AuthenticationService.Login(ctrl.username, ctrl.password, function (response) {
			    if (response.success) {
			        AuthenticationService.SetCredentials(ctrl.username, ctrl.password);
			        $location.path('/dashboard');
			    } else {
			        FlashService.Error(response.message);
			        ctrl.dataLoading = false;
			    }
			});*/
			$scope.errors = [];
			$scope.hasError = false;
			$scope.closeAlert = function(index) {
				$scope.errors.splice(index, 1);
			}
			
			obtainAccessToken($scope.loginData);
		}
		;

		function obtainAccessToken(params) {
			//var tempPass = params.password;
			tempParam.password = CryptoJS.MD5(params.password).toString();
			tempParam.username = params.username;
			var req = {
				method : 'POST',
				url : "oauth/token",
				headers : {
					"Content-type" : "application/x-www-form-urlencoded; charset=utf-8"
				},
				data : $httpParamSerializer(tempParam)
			}
			$http(req)
					.then(
							function(data) {
								$http.defaults.headers.common.Authorization = 'Bearer '
										+ data.data.access_token;
								/*var expireDate = new Date(new Date().getTime()
										+ (1000 * data.data.expires_in));
								$cookies.put("access_token",
										data.data.access_token, {
											'expires' : expireDate
										});
*/
								AuthenticationService.SetCredentials($scope.loginData.username, $scope.loginData.password, data.data.access_token, data.data.expires_in);
								window.location.href = "/shopadmin/tcg";
								// $location.path('/');

							},
							function(err) {
								console.log(err.data.error_description);
								//params.password = tempPass;
								$scope.hasError = true;
								if (err.data.error_description == "Bad credentials") {
									//console.log()
									//$scope.errors
									//		.push('Credenciales erradas. Intente de nuevo.');
									$scope.showError = function() {
										growl.error('Credenciales erradas. Intente de nuevo.', {
											title : 'Error!'
										});
									}
								} else {
									//$scope.errors.push('Error. Intente de nuevo.');
									$scope.showError = function() {
										growl.error('Error. Intente de nuevo.', {
											title : 'Error!'
										});
									}								

								}
								ctrl.dataLoading = false;
							});
		}
		;
		/*        
		 $scope.refreshAccessToken = function(){
		 obtainAccessToken($scope.refreshData);
		 }
		
		 $scope.logout = function() {
		 logout($scope.loginData);
		 }
		
		 function logout(params) {
		 var req = {
		 method: 'DELETE',
		 url: "oauth/token"
		 }
		 $http(req).then(
		 function(data){
		 //$cookies.remove("access_token");
		 $.removeCookie("access_token");
		 $location.path('/login');
		 },function(){
		 console.log("error");
		 }
		 );
		 }
		 */
	}
})();
