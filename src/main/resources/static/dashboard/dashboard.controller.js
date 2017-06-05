/*<![CDATA[*/


//$( document ).ready(function() {
//Define app variable with modules       
'use strict';
var application = angular.module('shopapp', ["ngResource","ngRoute","ngCookies","angular-jwt","ngMessages"]);
//.run(run);

//run.$inject = ['$rootScope', '$location', '$cookies', '$http'];

application.config(
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
);
			    
//['$rootScope', '$location', 'AuthenticationService', 'FlashService', '$http', '$httpParamSerializer', '$cookies']

//Define controller called mainCtrl
application.controller('DashboardController', function($scope,$resource,$http,$httpParamSerializer,$cookies,jwtHelper) {
	
	
	
	
	
	var vm = this;

  $scope.isLoggedIn = false;

  $scope.loginData = {grant_type:"password", username: "", password: "", client_id: "fooClientIdPassword"};
  $scope.refreshData = {grant_type:"refresh_token"};
  
  

  
  //$cookies.remove("access_token");			 
  /*var isLoginPage = window.location.href.indexOf("login") != -1;
  if(isLoginPage){
  	console.log("login page");
      if($cookies.get("access_token")){
      	//alert($cookies.get("access_token"));
          window.location.href = "/dashboard/index";
      	//window.location.href="http://localhost:3000";
      	//$location.path('/dashboard');
      }
  }else{*/
  $cookies.remove("access_token");
      if($cookies.get("access_token")){
          $http.defaults.headers.common.Authorization= 'Bearer ' + $cookies.get("access_token");
          //getOrganization();
          $scope.isLoggedIn = true;
      }else{
      	
      	//obtainAccessToken($scope.refreshData);
          $scope.isLoggedIn = false;
          window.location.href = "/#!/login";
      }
 // }
  
  
  
  (function initController() {
      // reset login status
      //AuthenticationService.ClearCredentials();
  })();
  
  
  

 
  
  
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
	  $cookies.remove("access_token");
      logout($scope.loginData);
	}
  
  function logout(params) {
      var req = {
          method: 'DELETE',
          url: "../oauth/token"
      }
      $http(req).then(
          function(data){
          	console.log("LOGOUT");
			    //$cookies.remove("access_token");
          		$cookies.remove("access_token");
			    delete $cookies['access_token'];
			    //$cookies.access_token = undefined;
			    alert("success logout:"+$cookies.get("access_token"));
			    $.removeCookie("access_token");
			    window.location.href = "/#!/login?cleansess=1";
			   // $location.path('/login');
			    
          },function(){
          	//$cookies.remove("access_token");
          	$cookies.remove("access_token");
          	delete $cookies['access_token'];
          	alert("ERROR logout:"+$cookies.get("access_token"));
          	//$.removeCookie("access_token");
			    //alert("after removal:"+$cookies.get("access_token"));
          	window.location.href = "/#!/login?cleansess=1";
          	console.log("LOGOUT");
              console.log("error");
          }
      );
  }	
});


//});

/*]]>*/