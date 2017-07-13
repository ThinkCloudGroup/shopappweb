(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'angular-growl'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
	        /*.when('/', {
	        	 controller: 'AuthController',
	             templateUrl: 'auth/auth.view.html',
	             controllerAs: 'ctrl'
	        })
           .when('/home', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm'
            })
            */
            .when('/admin', {
	            controller: 'AdminController',
	            templateUrl: 'admin/index.html',
	            controllerAs: 'ctrl'
	        })
	        
        	/*.when('/dashboard', {
	            controller: 'DashboardController',
	            templateUrl: 'dashboard/index.html',
	            controllerAs: 'ctrl'
	        })
*/
            .when('/login', {
            	 controller: 'LoginController',
                 templateUrl: 'login/login.view.html',
                 controllerAs: 'vm'
            })
            
           
            .when('/auth', {
                controller: 'AuthController',
                templateUrl: 'auth/auth.view.html',
                controllerAs: 'ctrl'
            })
            /*
             .when('/login/:clearsess', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
            })

            */
            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
                controllerAs: 'vm'
            })
            
           .when('/forgotpassword', {
                controller: 'ForgotpasswordController',
                templateUrl: 'forgotpassword/forgotpassword.view.html',
                controllerAs: 'vm'
            })
            
             .when('/resetpassword', {
                controller: 'ResetpasswordController',
                templateUrl: 'resetpassword/resetpassword.view.html',
                controllerAs: 'vm'
            })
          
            .otherwise({ redirectTo: '/auth' });
    }
    
    run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
    function run($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register', '/forgotpassword',  '/resetpassword', '/auth', '/']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/auth');
            }else{
            	//if($location.path()=="/")
            		//window.location.href = "/admin/index";
            }
        });
    }

})();