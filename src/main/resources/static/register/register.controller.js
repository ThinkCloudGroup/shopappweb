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

    RegisterController.$inject = ['$http','UserService', '$location', '$rootScope', 'FlashService', '$httpParamSerializer'];
    function RegisterController($http, UserService, $location, $rootScope, FlashService, $httpParamSerializer) {
        var vm = this;
       
        vm.user = {
        		firstName : "",
        		lastName : "",
        		username : "",
        		password : "",
        		address : "",
        		city : "",
        		country : "",
        		role : "",
        		roles:""
    		};

        vm.register = register;

        function register() {
        	vm.dataLoading = true;
        	$rootScope.errors = [];
        	$rootScope.hasError = false;
        	$rootScope.closeAlert = function(index) {
        		$rootScope.errors.splice(index, 1);
			}
            //vm.dataLoading = true;
            //alert(vm.user);
            console.log(vm);
            //return false;
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
            var tempPass = vm.user.password;
            vm.user.password = CryptoJS.MD5(vm.user.password).toString();
            
           
           /* $rootScope = {
        			grant_type : "password",
        			username : "",
        			password : "",
        			client_id : "fooClientIdPassword"
        		};
            */
            var req = {
    				method : 'POST',
    				url : "/shopapp/registration",
    				headers : {
    					"Content-type" : "application/x-www-form-urlencoded; charset=utf-8"
    				},
    				data : $httpParamSerializer(vm.user)
    			}
        	
        	$http(req)
			.then(
					function(response) {
						console.log(response);
						if(response.data.success==1){
							vm.dataLoading = false;
							$location.path('/login');
						}else{
							vm.user.password = tempPass; 
							$rootScope.hasError = true;
							$rootScope.errors.push(response.data.error);
						}
					},
					function(err) {
						vm.user.password = tempPass; 
						return err;
					}
			);
        }
    }

})();
