(function(){
	'use strict';

	var app = angular.module("mapApp", ['ngRoute', 'ngMaterial']);

	app.config(function($routeProvider){
		$routeProvider
		.when('/', {
			controller: 'MainController',
			templateUrl: 'views/main.html'
		})
		.otherwise({
			redirectTo: '/'
		});
	});
}());