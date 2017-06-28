(function() {
	'use strict';
	angular.module('app').config(
			function($routeProvider, $locationProvider, $httpProvider,
					$httpParamSerializerProvider, growlProvider) {
				 //growlProvider.globalPosition('bottom-center');
				 //growlProvider.globalInlineMessages(true);
				//growlProvider.globalTimeToLive(3000);
				//growlProvider.globalReversedOrder(true);
				// get the serializer from the provider
				//growlProvider.globalTimeToLive(5000);
				
				var paramSerializer = $httpParamSerializerProvider.$get();

				$routeProvider.when('/', {
					templateUrl : function(params) {
						// you can use paramSerializer(here
					}
				});
			}).controller('ForgotpasswordController', ForgotpasswordController);
	
	ForgotpasswordController.$inject = [ '$http', 'UserService', '$rootScope',
			'$httpParamSerializer', 'growl' ];
	function ForgotpasswordController($http, UserService, $rootScope,
			$httpParamSerializer, growl) {
		var vm = this;

		$rootScope.param = {
			username : ""
		};
		
		var responseParam = {
				username : ""
		}
		
		// $rootScope.forgotpassword = forgotpassword;
		vm.forgotpassword = forgotpassword;
/*
		$rootScope.showWarning = function() {
			growl.warning('This is warning message.', {
				title : 'Warning!'
			});
		}
		$rootScope.showError = function() {
			growl.error('This is error message.', {
				title : 'Error!'
			});
		}
		$rootScope.showSuccess = function() {
			growl.success('This is success message.', {
				title : 'Success!'
			});
		}
		$rootScope.showInfo = function() {
			growl.info('This is an info message.', {
				title : 'Info!'
			});
		}
		$rootScope.showAll = function() {
			growl.warning('This is warning message.', {
				title : 'Warning!'
			});
			growl.error('This is error message.', {
				title : 'Error!'
			});
			growl.success('This is success message.', {
				title : 'Success!'
			});
			growl.info('This is an info message.', {
				title : 'Info!'
			});
		}
*/
		var error = "";
		var success = "";
		function forgotpassword() {
			
			if(error != ""){
				error.destroy();
			}else if(success != ""){
				success.destroy();
			}
			

			vm.dataLoading = true;
			$rootScope.errors = [];
			$rootScope.hasError = false;
			$rootScope.closeAlert = function(index) {
				$rootScope.errors.splice(index, 1);
			}
			
			responseParam.username = $rootScope.param.username;

			var req = {
				method : 'POST',
				url : "shopapp/forgotPassword",
				headers : {
					"Content-type" : "application/x-www-form-urlencoded; charset=utf-8"
				},
				data : $httpParamSerializer(responseParam)
			}

			$http(req).then(function(response) {
				vm.dataLoading = false;
				$rootScope.hasError = true;
				console.log(response);
				if (response.data.success == 1) {
					//$rootScope.errors.push(response.data.success);
					success = growl.success(response.data.message, {
						title : 'Success!',
						referenceId: 1
					});
				} else {
					//$rootScope.errors.push(response.data.error);
					var msg="";
					console.log(response.data)
					if(response.data.error!=undefined){
						msg = response.data.error;
					}else{
						msg = response.data.message;
					}
					error = growl.error(msg, {
						title : 'Error!',
						referenceId: 1
					});
				}/*else{
					
				}*/

			}, function(err) {
				console.log(err);
				growl.error(err.data.error_description, {
					title : 'Error!',
					referenceId: 1
				});
				/*
				 * params.password = tempPass; $scope.hasError = true; if
				 * (err.data.error_description == "Bad credentials") {
				 * $scope.errors .push('Credenciales erradas. Intente de
				 * nuevo.'); } else { $scope.errors.push('Error. Intente de
				 * nuevo.');
				 * 
				 *  }
				 */
				vm.dataLoading = false;
			});

		}
	}
})();