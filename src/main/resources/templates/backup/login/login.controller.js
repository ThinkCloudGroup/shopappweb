(function () {
    'use strict';

    angular
        .module('app')
       /* .config(
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
        )*/
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope', '$location', 'AuthenticationService', 'FlashService', '$http', '$httpParamSerializer', '$cookies'];
    function LoginController($scope, $location, AuthenticationService, FlashService, $http, $httpParamSerializer, $cookies) {
        var vm = this;

        vm.login = login;
        
        $scope.isLoggedIn = false;
        
        
        
        
        /////////////////////
        $scope.loginData = {grant_type:"password", username: "", password: "", client_id: "fooClientIdPassword"};
        $scope.refreshData = {grant_type:"refresh_token"};
          
        var isLoginPage = window.location.href.indexOf("login") != -1;
        if(isLoginPage){
            if($cookies.get("access_token")){
                window.location.href = "home";
            }
        }else{
            if($cookies.get("access_token")){
                $http.defaults.headers.common.Authorization= 'Bearer ' + $cookies.get("access_token");
                //getOrganization();
                $scope.isLoggedIn = true;
            }else{
            	obtainAccessToken($scope.refreshData);
                $scope.isLoggedIn = false;
                //window.location.href = "/";
            }
        } 
        //////////////////
        
        
        
        
        

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
        	//alert("login");
            vm.dataLoading = true;
            /*AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });*/
            console.log("just before");
            //console.log($scope.refreshData);
            $scope.errors = [];
        	$scope.hasError = false;
        	$scope.closeAlert = function (index) {
        	    $scope.errors.splice(index, 1);
        	}
            obtainAccessToken($scope.loginData);
            console.log("just after");
        };
        
        
        function obtainAccessToken(params){
        	console.log("params");
        	console.log(params);
            var req = {
                method: 'POST',
                url: "oauth/token",
                headers: {"Content-type": "application/x-www-form-urlencoded; charset=utf-8"},
                data: $httpParamSerializer(params)
            }
            //console.log($httpParamSerializer(params));
            $http(req).then(
                function(data){
                	//alert()
                    $http.defaults.headers.common.Authorization= 'Bearer ' + data.data.access_token;
                    var expireDate = new Date (new Date().getTime() + (1000 * data.data.expires_in));
                    $cookies.put("access_token", data.data.access_token, {'expires': expireDate});
                    window.location.href="home";
                },function(err){
                	$scope.hasError = true;
                	if(err.data.error_description=="Bad credentials"){
                		$scope.errors.push('Credenciales erradas. Intente de nuevo.');	 
                	}else{
                		$scope.errors.push('Error. Intente de nuevo.');
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
    			    window.location.href="login";
                },function(){
                    console.log("error");
                }
            );
        }

    }

})();
