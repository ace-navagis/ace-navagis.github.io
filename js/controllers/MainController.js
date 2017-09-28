(function(){
	'use strict';

	var app = angular.module("mapApp");

	var MainController = function($scope, mapsApi){
		$scope.initialize = function() {
			console.log("in initialize");
			//infoBox plugin
			var s = document.createElement("script");
			s.type = "text/javascript";
			s.src = "js/infobox.js";
			document.head.appendChild(s);
			//---------------------------------------

			$scope.specialty = {};
			$scope.getSpecialty = _getSpecialty;
			var map;
			var data = [];
			var compiledData = [];
			var currentSearch;
			var masterPlaces;
			var markers = {
				pizza: [],
				pasta: [],
				chicken: [],
				pastry: [],
				desserts: [],
				coffee: [],
				japanese: [],
				korean: []
			};
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
			var infowindow = mapsApi.newInfoWindow();
			var createCircle = _createCircle;
			var getPlaces = _getPlaces;
			var getResponse = _getResponse;
			var plotRestaurants = _plotRestaurants;
			var removeMarkers = _removeMarkers;
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

				plotRestaurants();
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
					// loadMap();
					plotRestaurants();
				} else {
					// $(document).ready(function(){
					// 	$('.load-msg').removeClass('hidden');
					// 	$('#floating-panel').addClass('hidden');

					// });
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

					if(!data.length){
						data = places[currentSearch];
					}
					plotRestaurants();

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
						// loading = false;
						compiledData = [];
						currentSearch = null;
						$(document).ready(function(){
							$('.load-msg').addClass('hidden');
							$('#floating-panel').removeClass('hidden');

						});
						// loadMap();
					}
				}
			}

			function _plotRestaurants() {
				var marker;
				// markers[currentSearch] = [];

				for (var i = 0; i < data.length; i++) {

					marker = mapsApi.newMarker(data[i].geometry.location, map);

					mapsApi.mapAddListener(marker,'click', (function(marker,data,infowindow){
				        return function() {
							   this.visited++;
							   var content = '<div class="infowindow-content"><div class="place-name"><strong>' + data.name + '</strong></div>' +
					                '<div class="place-info">' + data.formatted_address + '<br>' +
					                '<span>Visited <strong>' + this.visited + '</strong>' + (this.visited > 1 ? ' times.' : ' time.') + '</span><br>' +
					                '<a href="#" class="place-details" data-placeid="'+ data.place_id + '">See place details</a>' + '</div>' +
					                '<button class="get-directions" data-lat="' +  data.geometry.location.lat() +
					                '" data-lng="' + data.geometry.location.lng() + '">Get Directions</button>' +
					                ' </div>';
					           infowindow.setContent(content);
					           infowindow.open(map,marker);
					           map.panTo(marker.getPosition());
					           $(document).ready(function(){
					           		$('#details-panel').addClass('hidden');
					           });
					        };
					    })(marker,data[i],infowindow));

					// console.log("markers." + currentSearch + ": " + markers[currentSearch].length);
					markers[currentSearch].push(marker);
				}

				// var markerCluster = new MarkerClusterer(map, markers, { imagePath: 'img/'});

				// mapsApi.mapAddListener(markerCluster, 'clusterclick', function(e) {
				//     $(document).ready(function(){
			 //           	$('#details-panel').addClass('hidden');
			 //        });
				// });

				mapsApi.mapAddListener(infowindow, 'closeclick', function(e){
					$(document).ready(function(){
			           	$('#details-panel').addClass('hidden');
			        });
				});

				// reset data holders
				// data = [];
				// compiledData = [];
			}

			function _getSpecialty (specialty){
		    	if(!specialty.indexOf("restaurant")){
		    		getPlaces(specialty, specialty.substr(specialty.indexOf(", ") + 2));
		    	} else {
		    		data = [];
		            switch(specialty) {
						case "pizza":
							places.pizza = [];
							data = data.concat(places.pasta)
								.concat(places.chicken)
								.concat(places.pastry)
								.concat(places.desserts)
								.concat(places.coffee)
								.concat(places.japanese)
								.concat(places.korean);
							break;
						case "pasta":
							places.pasta = [];
							data = data.concat(places.pizza)
								.concat(places.chicken)
								.concat(places.pastry)
								.concat(places.desserts)
								.concat(places.coffee)
								.concat(places.japanese)
								.concat(places.korean);
							break;
						case "chicken":
							places.chicken = [];
							data = data.concat(places.pizza)
								.concat(places.pasta)
								.concat(places.pastry)
								.concat(places.desserts)
								.concat(places.coffee)
								.concat(places.japanese)
								.concat(places.korean);
							break;
						case "pastry":
							places.pastry = [];
							data = data.concat(places.pizza)
								.concat(places.pasta)
								.concat(places.chicken)
								.concat(places.desserts)
								.concat(places.coffee)
								.concat(places.japanese)
								.concat(places.korean);
							break;
						case "desserts":
							places.desserts = [];
							data = data.concat(places.pizza)
								.concat(places.pasta)
								.concat(places.chicken)
								.concat(places.pastry)
								.concat(places.coffee)
								.concat(places.japanese)
								.concat(places.korean);
							break;
						case "coffee":
							places.coffee = [];
							data = data.concat(places.pizza)
								.concat(places.pasta)
								.concat(places.chicken)
								.concat(places.pastry)
								.concat(places.desserts)
								.concat(places.japanese)
								.concat(places.korean);
							break;
						case "japanese":
							places.japanese = [];
							data = data.concat(places.pizza)
								.concat(places.pasta)
								.concat(places.chicken)
								.concat(places.pastry)
								.concat(places.desserts)
								.concat(places.coffee)
								.concat(places.korean);
							break;
						case "korean":
							places.korean = [];
							data = data.concat(places.pizza)
								.concat(places.pasta)
								.concat(places.chicken)
								.concat(places.pastry)
								.concat(places.desserts)
								.concat(places.coffee)
								.concat(places.japanese);
							break;
						default:
							break;
					}
					console.log(markers[specialty].length);
					removeMarkers(specialty);
					// loadMap();
		    	}
		    }

		    function _removeMarkers(specialty){
			    for(var i=0; i<markers[specialty].length; i++){
			        markers[specialty][i].setMap(null);
			    }
			    markers[specialty] = [];
			}

	    };
	};

	app.controller("MainController", MainController);
}());