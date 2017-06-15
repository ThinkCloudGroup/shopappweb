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
        
        //vm.user.username.$setValidity("youAreFat", false);
        
        //form['username'].$setValidity('required', false);
        
        //form['username'].$valid = false;
        
        //$scope.formName[inputName].$setValidity
        /*
        $rootScope.$watch('password', function(val) {
            //$scope.message = 'Your message Hash is: ' + md5.createHash($scope.email || '');
        	 vm.user.password = CryptoJS.MD5(vm.user.password).toString();
          });
*/
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
            
            var tempConfPass = vm.user.confirmPassword;
            
            vm.user.password = vm.user.confirPassword = CryptoJS.MD5(vm.user.password).toString();
            
           
            
            //vm.user.confirPassword = CryptoJS.MD5(vm.user.confirmPassword).toString();
            
           
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
    				data : $httpParamSerializer(vm.user)/*,
    				transformResponse: appendTransform($http.defaults.transformResponse, function(value) {
    	        		console.log("transform response:");
    	        		console.log(value);
    				    //return doTransform(value);
    	        		return value;
    				  })*/
    			}
        	
        	$http(req)
        	
			.then(
					function(response) {
						console.log("REGISTRATION RESPONSE:");
						console.log(response);
						//response = JSON.parse(response);
						if(response.data.success==1 || response.success==1){
							
							$location.path('/login');
						}else{
							vm.user.password = tempPass; 
							vm.user.confirmPassword = tempConfPass;
							$rootScope.hasError = true;
							$rootScope.errors.push(response.data.error);
						}
						vm.dataLoading = false;
					},
					function(err) {
						console.log("REGISTRATION RESPONSE ERROR:");
						
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