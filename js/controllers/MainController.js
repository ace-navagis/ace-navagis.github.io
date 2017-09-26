(function(){
	'use strict';

	var app = angular.module("mapApp");

	var MainController = function($scope, mapsApi){
		$scope.initialize = function() {
			//infoBox plugin
			var s = document.createElement("script");
			s.type = "text/javascript";
			s.src = "js/infobox.js";
			document.head.appendChild(s);
			//---------------------------------------

			var map;
			var data = [];
			var compiledData = [];
			var currentSearch;
			var masterPlaces;
			var places = {
				pizza: [],
				pasta: [],
				chicken: [],
				pastry: [],
				desserts: [],
				coffee: [],
				japanese: [],
				korean: []
			};
			var cebuLatLng = mapsApi.newLatLng(10.3226903, 123.8975747);
			var drawingManager = mapsApi.newDrawingManager();
			var createCircle = _createCircle;
			var getPlaces = _getPlaces;
			var getResponse = _getResponse;
			var placesService;

			var loadMap = function(){

				map = mapsApi.newMap(cebuLatLng);
				placesService = mapsApi.newPlaces(map);
				drawingManager.setMap(map);
				mapsApi.mapAddListener(drawingManager, 'circlecomplete', function(event){
					// Get circle center and radius
			        var center = event.getCenter();
			        var radius = event.getRadius();

			        // Remove overlay from map
			        event.setMap(null);
			        drawingManager.setDrawingMode(null);

			        // Create circle
			        createCircle(center, radius, map);
				});

			};
			loadMap();
			//-------------------------------

			function _createCircle(center, radius, map){
				var circle = mapsApi.newCircle(center, radius, map);
			}

			function _getPlaces (type, id){
				var request = {
					    location: cebuLatLng,
					    query: type
					};

				currentSearch = id;

				if(masterPlaces && masterPlaces[currentSearch].length) {
					// console.log("parsing masterplaces");
					places[currentSearch] = masterPlaces[currentSearch];
					if(data.length === 0) {
						data = masterPlaces[currentSearch];
						// console.log(data);
					} else {
						data = data.concat(masterPlaces[currentSearch]);
						// console.log(data);
					}
					$(document).ready(function(){
						$('.load-msg').addClass('hidden');
						$('#floating-panel').removeClass('hidden');

					});
					loadMap();
				} else {
					$(document).ready(function(){
						$('.load-msg').removeClass('hidden');
						$('#floating-panel').addClass('hidden');

					});
					placesService.textSearch(request, getResponse);
				}
			}

			function _getResponse(results, status, pagination) {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					if(compiledData.length === 0) {
						compiledData = results;
					} else {
						switch(currentSearch) {
							case "pizza":
								places.pizza = compiledData.concat(results);
								compiledData = places.pizza;
								break;
							case "pasta":
								places.pasta = compiledData.concat(results);
								compiledData = places.pasta;
								break;
							case "chicken":
								places.chicken = compiledData.concat(results);
								compiledData = places.chicken;
								break;
							case "pastry":
								places.pastry = compiledData.concat(results);
								compiledData = places.pastry;
								break;
							case "desserts":
								places.desserts = compiledData.concat(results);
								compiledData = places.desserts;
								break;
							case "coffee":
								places.coffee = compiledData.concat(results);
								compiledData = places.coffee;
								break;
							case "japanese":
								places.japanese = compiledData.concat(results);
								compiledData = places.japanese;
								break;
							case "korean":
								places.korean = compiledData.concat(results);
								compiledData = places.korean;
								break;
							default:
								break;
						}
					}

					if (pagination.hasNextPage) {
						pagination.nextPage();
					} else {
						console.log('done getting all data.');
						// console.log(places);
						if(!masterPlaces) {
							masterPlaces = jQuery.extend(true, {}, places);
						} else {
							masterPlaces[currentSearch] = places[currentSearch];
						}
						if(data.length === 0) {
							data = places[currentSearch];
							// console.log(data);
						} else {
							data = data.concat(places[currentSearch]);
							// console.log(data);
						}
						loading = false;
						compiledData = [];
						currentSearch = null;
						$(document).ready(function(){
							$('.load-msg').addClass('hidden');
							$('#floating-panel').removeClass('hidden');

						});
						loadMap();
					}
				}
			}

	    };
	};

	app.controller("MainController", MainController);
}());