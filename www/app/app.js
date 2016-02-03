angular.module('notify', ['ngRoute', 'MainController', 'MainService'])
.config(function($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
})
.run (function($rootScope, $location, $window) {
	$rootScope.$on('$routeChangeStart', function (event, next) {
		// redirect user to register page if they are not authenticated and try to access secure page
		if (!$window.sessionStorage.token && next.isLogin) $location.url('/register');
		else $location.url(next.originalPath);	// otherwise, allow user to continue
	});
})
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	
	$routeProvider
		.when('/', {
			templateUrl: 'templates/home.html',
			controller: 'HomeController'
		})
		.when('/login', {
			templateUrl: 'templates/login.html',
			controller: 'LoginController'
		})
		.when('/register', {
			templateUrl: 'templates/register.html',
			controller: 'RegisterController'
		})
		.when('/account', {
			templateUrl: 'templates/account.html',
			controller: 'AccountController',
			isLogin: true
		})
		.otherwise({
			redirectTo: '/'
		});
}])
