(function() {
	'use strict';

	angular.module('app').config(
			function($routeProvider, $locationProvider, $httpProvider,
					$httpParamSerializerProvider) {

				// get the serializer from the provider
				var paramSerializer = $httpParamSerializerProvider.$get();
				console.log(paramSerializer({
					a : 1
				})); // test it

				$routeProvider.when('/', {
					templateUrl : function(params) {
						// you can use paramSerializer(here
					}
				});
			}).factory('AuthenticationService', AuthenticationService);

	AuthenticationService.$inject = [ '$http', '$cookies', '$rootScope', '$httpParamSerializer' ];
	function AuthenticationService($http, $cookies, $rootScope, $httpParamSerializer) {
		var service = {};

		service.Login = Login;
		service.SetCredentials = SetCredentials;
		service.ClearCredentials = ClearCredentials;

		return service;

		function Login(loginData, callback) {

			var req = {
				method : 'POST',
				url : "oauth/token",
				headers : {
					"Content-type" : "application/x-www-form-urlencoded; charset=utf-8"
				},
				data : $httpParamSerializer(loginData)
			}

			$http(req)
					.then(
							function mySuccess(response) {
								//if (user !== null && user.password === password) {
								response = {
									success : true,
									access_token : response.data.access_token,
									expires_in : response.data.expires_in
								};
								/*} else {
								    response = { success: false, message: 'Username or password is incorrect' };
								}*/
								callback(response);

							},
							function myError(response) {
								alert("error service");
								$rootScope.hasError = true;
						    	$rootScope.errors.push('Credenciales erradas. Intente de nuevo.');	 
						    	
								response = {
										success : false,
										resp : response
									};
								callback(response);
								
								/*if (response.data.error_description == "Bad credentials") {
									$rootScope.errors
											.push('Credenciales erradas. Intente de nuevo.');
								} else {
									//$scope.errors.push('Error. Intente de nuevo.');
									vm.dataLoading = false;

								}

								var req = {
									method : 'POST',
									url : "oauth/token",
									headers : {
										"Content-type" : "application/x-www-form-urlencoded; charset=utf-8"
									},
									data : $httpParamSerializer({
										grant_type : "refresh_token"
									})
								}
								//console.log($httpParamSerializer(params));
								$http(req)
										.then(
												function mySuccess(response) {
													//$scope.myWelcome = response.data;
													//if (user !== null && user.password === password) {
													response = {
														success : true,
														access_token : response.data.access_token,
														expires_in : response.data.expires_in
													};
													} else {
													    response = { success: false, message: 'Username or password is incorrect' };
													}
													callback(response);

												}, function myError(response) {

												});

								response = {
									success : false
								};
								callback(response);
								*/
							}
							

					/*
					function(data) {
						$http.defaults.headers.common.Authorization = 'Bearer '
								+ data.data.access_token;
						var expireDate = new Date(new Date().getTime()
								+ (1000 * data.data.expires_in));
						AuthenticationService.SetCredentials(loginData.username, loginData.password);
						window.location.href = "/dashboard/index";
						//$location.path('/home');

					},
					function(err) {
						$scope.hasError = true;
						if (err.data.error_description == "Bad credentials") {
							$rootScope.errors
									.push('Credenciales erradas. Intente de nuevo.');
						} else {
							//$scope.errors.push('Error. Intente de nuevo.');
							vm.dataLoading = false;

						}
					}*/
					);
		};

		function SetCredentials(username, password, acc_token, expires_in) {
			var authdata = Base64.encode(username + ':' + password);

			$rootScope.globals = {
				currentUser : {
					username    : username,
					access_token: acc_token,
					expires_in  : expires_in,
					authdata    : authdata
				}
			};

			// set default auth header for http requests
			$http.defaults.headers.common['Authorization'] = 'Basic ' + acc_token;//authdata;

			// store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
			var cookieExp = new Date();
			cookieExp.setDate(cookieExp.getDate() + 7);
			$cookies.putObject('globals', $rootScope.globals, {
				expires : cookieExp
			});
		}

		function ClearCredentials() {
			
			//$.cookie("filter", null);
			//$.removeCookie("filter);
			//$.cookie('refreshToken', null, { path: '/' });
			//$.removeCookie('refreshToken', { path: '/' });
			//$.cookie('refreshToken', null, {path:'/'})
			//document.cookie = 'refreshToken' + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
			//$.removeCookie('the_cookie', { path: '/' });
			$rootScope.globals = {};
			$cookies.remove('globals');
			$rootScope.refreshToken = {};
			$cookies.remove("refreshToken");
			$http.defaults.headers.common.Authorization = 'Basic';
		}
	}

	// Base64 encoding service used by AuthenticationService
	var Base64 = {

		keyStr : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

		encode : function(input) {
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;

			do {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}

				output = output + this.keyStr.charAt(enc1)
						+ this.keyStr.charAt(enc2) + this.keyStr.charAt(enc3)
						+ this.keyStr.charAt(enc4);
				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";
			} while (i < input.length);

			return output;
		},

		decode : function(input) {
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;

			// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
			var base64test = /[^A-Za-z0-9\+\/\=]/g;
			if (base64test.exec(input)) {
				window
						.alert("There were invalid base64 characters in the input text.\n"
								+ "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n"
								+ "Expect errors in decoding.");
			}
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			do {
				enc1 = this.keyStr.indexOf(input.charAt(i++));
				enc2 = this.keyStr.indexOf(input.charAt(i++));
				enc3 = this.keyStr.indexOf(input.charAt(i++));
				enc4 = this.keyStr.indexOf(input.charAt(i++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				output = output + String.fromCharCode(chr1);

				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}

				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";

			} while (i < input.length);

			return output;
		}
	};

})();