(function () {
    'use strict';

    angular
        .module('app')
        
        .config(
        		  function($routeProvider, $locationProvider, $httpProvider, $httpParamSerializerProvider) {

        			    // get the serializer from the provider
        			    var paramSerializer = $httpParamSerializerProvider.$get();
        			    console.log(paramSerializer({a:1})); // test it

        			    $routeProvider.when('/', {
        			      templateUrl: function(params) {
        			        // you can use paramSerializer(here
        			      }
        			    });
        		  }
        )
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope', '$location', 'AuthenticationService', 'FlashService', '$http', '$httpParamSerializer', '$cookies'];
    function LoginController($scope, $location, AuthenticationService, FlashService, $http, $httpParamSerializer, $cookies) {
        var vm = this;

        vm.login = login;
        
        $scope.isLoggedIn = false;

        $scope.loginData = {grant_type:"password", username: "", password: "", client_id: "fooClientIdPassword"};
        $scope.refreshData = {grant_type:"refresh_token"};
          
        var isLoginPage = window.location.href.indexOf("login") != -1;
        if(isLoginPage){
        	console.log("login page");
            if($cookies.get("access_token")){
                window.location.href = "/dashboard/index";
            	//window.location.href="http://localhost:3000";
            	//$location.path('/dashboard');
            }
        }else{
            if($cookies.get("access_token")){
                $http.defaults.headers.common.Authorization= 'Bearer ' + $cookies.get("access_token");
                //getOrganization();
                $scope.isLoggedIn = true;
            }else{
            	obtainAccessToken($scope.refreshData);
                $scope.isLoggedIn = false;
            }
        }

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();
        
        
        

        function login() {
            vm.dataLoading = true;
            /*
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/dashboard');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });*/
            $scope.errors = [];
        	$scope.hasError = false;
        	$scope.closeAlert = function (index) {
        	    $scope.errors.splice(index, 1);
        	}
        	AuthenticationService.SetCredentials(vm.username, vm.password);
        	//$location.path('/dashboard');
        	obtainAccessToken($scope.loginData, $location );
        	//window.location.href="http://localhost:3000";
        };
        
        
        function obtainAccessToken(params){
            var req = {
                method: 'POST',
                url: "oauth/token",
                headers: {"Content-type": "application/x-www-form-urlencoded; charset=utf-8"},
                data: $httpParamSerializer(params)
            }
            console.log($httpParamSerializer(params));
            $http(req).then(
                function(data){
                    $http.defaults.headers.common.Authorization= 'Bearer ' + data.data.access_token;
                    var expireDate = new Date (new Date().getTime() + (1000 * data.data.expires_in));
                    $cookies.put("access_token", data.data.access_token, {'expires': expireDate});
                    
                    window.location.href="/dashboard/index";
                    //loc.path('/');
                    //loc.path('/dashboard');
                },function(err){
                	$scope.hasError = true;
                	if(err.data.error_description=="Bad credentials"){
                		$scope.errors.push('Credenciales erradas. Intente de nuevo.');	 
                	}else{
                		//$scope.errors.push('Error. Intente de nuevo.');
                		logout($scope.loginData);
                		obtainAccessToken($scope.loginData);
                		vm.dataLoading = false;
                		console.log(err);
                	}
                }
            );
        };
        
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
    			    $cookies.remove("access_token");
    			    $location.path('/login');
                },function(){
                    console.log("error");
                }
            );
        }
    }
})();
