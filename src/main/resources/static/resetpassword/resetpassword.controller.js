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
			}).controller('ResetpasswordController', ResetpasswordController);
	
	ResetpasswordController.$inject = [ '$http', 'UserService', '$rootScope',
			'$httpParamSerializer', 'growl', '$routeParams' ];
	function ResetpasswordController($http, UserService, $rootScope,
			$httpParamSerializer, growl, $routeParams) {
		var vm = this;
//console.log($routeParams);
		$rootScope.param = {
				id: $routeParams.id,
				token: $routeParams.token,
				newpassword : ""
		};
		
		var responseParam = {
				id: $routeParams.id,
				token: $routeParams.token,
				newpassword : ""
		};
		
		$rootScope.errors = [];
		$rootScope.hasError = false;
		$rootScope.closeAlert = function(index) {
			$rootScope.errors.splice(index, 1);
		}
		
		vm.resetpassword = resetpassword;
		
		vm.formBox = true;
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
	
		function resetpassword() {

			/*
			if(error != ""){
				error.destroy();
			}else if(success != ""){
				success.destroy();
			}*/
			

			vm.dataLoading = true;
			
			responseParam.newpassword = CryptoJS.MD5($rootScope.param.newpassword).toString();
			
			var req = {
				method : 'POST',
				url : "shopapp/resetPassword",
				headers : {
					"Content-type" : "application/x-www-form-urlencoded; charset=utf-8"
				},
				data : $httpParamSerializer(responseParam)
			}

			$http(req).then(function(response) {
				vm.dataLoading = false;
				
				//$rootScope.hasError = true;
				//console.log(response);
				//$rootScope.param.newpassword = $rootScope.param.newpasswordconfirm = tempPass;
				if (response.data.success == 1) {
					vm.formBox = false;
					vm.backLogin = true;
					//$rootScope.errors.push(response.data.success);
					success = growl.success(response.data.message, {
						title : 'Success!',
						referenceId: 1
					});
				} else {					
					vm.backLogin = true;
					vm.backLogin = false;
					//$rootScope.param.newpassword = $rootScope.param.newpasswordconfirm = tempPass;
					
					//$rootScope.errors.push(response.data.error);
					error = growl.error(response.data.error, {
						title : 'Error!',
						referenceId: 1
					});
				}

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