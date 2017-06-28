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
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$http','UserService', '$location', '$rootScope', 'FlashService', '$httpParamSerializer', 'growl'];
    function RegisterController($http, UserService, $location, $rootScope, FlashService, $httpParamSerializer, growl) {
        var vm = this;
        
        vm.formBox = true;
       
        vm.user = {
        		firstName : "",
        		lastName : "",
        		username : "",
        		password : "",
        		address : "",
        		city : "",
        		country : ""
    		};
        
        var tempParams = {
        		firstName : "",
        		lastName : "",
        		username : "",
        		password : "",
        		address : "",
        		city : "",
        		country : ""     		
        }

        vm.register = register;
        
       
        function register() {
        	vm.dataLoading = true;
        	$rootScope.errors = [];
        	$rootScope.hasError = false;
        	$rootScope.closeAlert = function(index) {
        		$rootScope.errors.splice(index, 1);
			}
            
        	
        	
            /*UserService.Create(vm.user)
                .then(function (response) {
                	console.log(response);
                    if (response.success) {
                        //FlashService.Success('Registration successful', true);
                        //$location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });*/
            
        	tempParams.firstName = vm.user.firstName;
        	tempParams.lastName = vm.user.lastName;
        	tempParams.username = vm.user.username;
        	tempParams.password = CryptoJS.MD5(vm.user.password).toString();
        	tempParams.address = vm.user.address;
        	tempParams.city = vm.user.city;
        	tempParams.country = vm.user.country;
        	
            var req = {
    				method : 'POST',
    				url : "/shopapp/registration",
    				headers : {
    					"Content-type" : "application/x-www-form-urlencoded; charset=utf-8"
    				},
    				data : $httpParamSerializer(tempParams)
    			}
        	
        	$http(req).then(
					function(response) {
						if(response.data.success==1 || response.success==1){
							vm.formBox = false;
							vm.backLogin = true;
							growl.success(response.data.message, {
								title : 'Success',
								referenceId: 1
							});
							//$location.path('/login');
						}else{
							vm.backLogin = true;
							//$rootScope.hasError = true;
							//$rootScope.errors.push(response.data.error);
							growl.error(response.data.message, {
								title : 'Error !',
								referenceId: 1
							});
						}
						vm.dataLoading = false;
					},
					function(err) {
						vm.backLogin = true;
						
						vm.user.password = tempPass; 
						vm.user.confirmPassword = tempConfPass;
						$rootScope.hasError = true;
						$rootScope.errors.push(response.data.error);
						vm.dataLoading = false;
						
						//$rootScope.username.$setValidity("youAreFat", false);
						//$rootScope.username.$valid = false;
						//return err;
					}
			);
        }
    }
})();