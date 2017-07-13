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
application.$inject = [ '$rootScope', '$location',
                			'AuthenticationService', 'FlashService', '$http',
                			'$httpParamSerializer', '$cookies', '$routeParams' ];			    
//['$rootScope', '$location', 'AuthenticationService', 'FlashService', '$http', '$httpParamSerializer', '$cookies']

//Define controller called mainCtrl
application.controller('DashboardController', function($rootScope,$resource,$http,$httpParamSerializer,$cookies,jwtHelper) {
	
	var ctrl = this;

	$rootScope.isLoggedIn = false;

	$rootScope.loginData = {grant_type:"password", username: "", password: "", client_id: "fooClientIdPassword"};
	$rootScope.refreshData = {grant_type:"refresh_token"};
  
  
	
  
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
  
  
  //$cookies.remove("access_token");
  console.log($rootScope.globals);
  //alert($cookies.get("globals"));
  //var loggedIn = $rootScope.globals;
      if($cookies.get("globals")){
    	  var global = angular.fromJson($cookies.get("globals"));
    	  
    	 // console.log(test.currentUser.access_token);
          $http.defaults.headers.common.Authorization= 'Bearer ' + global.currentUser.access_token;
          //getOrganization();
          $rootScope.isLoggedIn = true;
      }else{
      	
      	//obtainAccessToken($scope.refreshData);
    	  $rootScope.isLoggedIn = false;
          window.location.href = "/#!/auth";
      }
 // }
  
  
   /*
  
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
          		ctrl.dataLoading = false;
          		console.log(err);
          	}
          }
      );
  };
  
  $scope.refreshAccessToken = function(){
  	obtainAccessToken($scope.refreshData);
  }
	*/
  $rootScope.logout = function() {
	  $cookies.remove("globals");
      logout($rootScope.loginData);
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
          		//$cookies.remove("access_token");
			    //delete $cookies['access_token'];
			    //$cookies.access_token = undefined;
			    //alert("success logout:"+$cookies.get("access_token"));
			    //$.removeCookie("access_token");
			    window.location.href = "/#!/dashboard";
			   // $location.path('/login');
			    
          },function(){
          	//$cookies.remove("access_token");
          	//$cookies.remove("access_token");
          	//delete $cookies['access_token'];
          	//alert("ERROR logout:"+$cookies.get("access_token"));
          	//$.removeCookie("access_token");
			    //alert("after removal:"+$cookies.get("access_token"));
          	window.location.href = "/#!/dashboard?cleansess=1";
          	//console.log("LOGOUT");
             // console.log("error");
          }
      );
  }	
});


//});

/*]]>*/