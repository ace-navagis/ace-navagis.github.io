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
			$scope.loading = false;
			var map;
			var data = [];
			var compiledData = [];
			var currentSearch;
			var masterPlaces;
			var masterMarkers = [];
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
			var placeMarkers = _placeMarkers;
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

				// plotRestaurants();
			};
			loadMap();
			//-------------------------------

			function _createCircle(center, radius, map){

				var circleLabel;
				var labelOptions = {
					content: "",
					boxStyle: {
					  border: "none",
					  textAlign: "center",
					  fontSize: "40px",
					  fontWeight: "700",
					  width: "50px",
					  color: '#d74246'
					},
					disableAutoPan: true,
					pixelOffset: new google.maps.Size(-25, 7),
					position: null,
					closeBoxURL: "",
					isHidden: false,
					pane: "floatPane",
					enableEventPropagation: true
				};
				var circle = mapsApi.newCircle(center, radius, map);

				var counter = 0;
				for (var i = 0; i < masterMarkers.length; i++) {
					if (circle.getBounds().contains(masterMarkers[i].getPosition())) {
						counter++;
					}
				}

				labelOptions.content = counter.toString();
				labelOptions.position = circle.getCenter();
				circleLabel = new InfoBox(labelOptions);
				circleLabel.open(map);

				mapsApi.mapAddListener(circle, 'radius_changed', function (event) {

			    	if(circleLabel){
		                circleLabel.close();
		            }

			        var counter = 0;
			        for (var i = 0; i < masterMarkers.length; i++) {
						if (circle.getBounds().contains(masterMarkers[i].getPosition())) {
							counter++;
						}
					}

					labelOptions.content = counter.toString();
					labelOptions.position = circle.getCenter();
					circleLabel = new InfoBox(labelOptions);
					circleLabel.open(map);
			    });

			    mapsApi.mapAddListener(circle, 'center_changed', function (event) {

			        if(circleLabel){
		                circleLabel.close();
		            }

			        var counter = 0;
			        console.log(masterMarkers.length);
			        for (var i = 0; i < masterMarkers.length; i++) {
						if (circle.getBounds().contains(masterMarkers[i].getPosition())) {
							counter++;
						}
					}

					labelOptions.content = counter.toString();
					labelOptions.position = circle.getCenter();
					circleLabel = new InfoBox(labelOptions);
					circleLabel.open(map);
			    });

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
					// plotRestaurants();
					placeMarkers(currentSearch);
				} else {
					// $(document).ready(function(){
					// 	$('.load-msg').removeClass('hidden');
					// 	$('#floating-panel').addClass('hidden');

					// });
					$scope.loading = true;
					placesService.textSearch(request, getResponse);
				}
			}

			function _getResponse(results, status, pagination) {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					if(compiledData.length === 0) {
						compiledData = results;
						data = results;
						plotRestaurants();
					} else {
						switch(currentSearch) {
							case "pizza":
								data = results;
								plotRestaurants();
								places.pizza = compiledData.concat(results);
								compiledData = places.pizza;
								break;
							case "pasta":
								data = results;
								plotRestaurants();
								places.pasta = compiledData.concat(results);
								compiledData = places.pasta;
								break;
							case "chicken":
								data = results;
								plotRestaurants();
								places.chicken = compiledData.concat(results);
								compiledData = places.chicken;
								break;
							case "pastry":
								data = results;
								plotRestaurants();
								places.pastry = compiledData.concat(results);
								compiledData = places.pastry;
								break;
							case "desserts":
								data = results;
								plotRestaurants();
								places.desserts = compiledData.concat(results);
								compiledData = places.desserts;
								break;
							case "coffee":
								data = results;
								plotRestaurants();
								places.coffee = compiledData.concat(results);
								compiledData = places.coffee;
								break;
							case "japanese":
								data = results;
								plotRestaurants();
								places.japanese = compiledData.concat(results);
								compiledData = places.japanese;
								break;
							case "korean":
								data = results;
								plotRestaurants();
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
						$scope.$evalAsync(function () {
							$scope.loading = false;
						});
						// console.log(places);
						if(!masterPlaces) {
							// masterPlaces = jQuery.extend(true, {}, places);
							masterPlaces = 	angular.copy(places);
						} else {
							masterPlaces[currentSearch] = places[currentSearch];
						}
						// if(data.length === 0) {
						// 	data = places[currentSearch];
						// 	// console.log(data);
						// } else {
						// 	data = data.concat(places[currentSearch]);
						// 	// console.log(data);
						// }
						data = [];
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
					masterMarkers.push(marker);
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
				console.log(markers[currentSearch]);
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
					// console.log(markers[specialty].length);
					removeMarkers(specialty);
					// loadMap();
		    	}
		    }

		    function _removeMarkers(specialty){
			    for(var i=0; i<markers[specialty].length; i++){
			        markers[specialty][i].setMap(null);
			        for(var x=0; x<masterMarkers.length; x++){
			        	if(markers[specialty][i].getPosition().equals(masterMarkers[x].getPosition())){
			        		masterMarkers.splice(masterMarkers.indexOf(masterMarkers[x]), 1);
			        		console.log("removed marker in masterMarkers");
			        	}
			        }
			    }
			    // markers[specialty] = [];
			}

			function _placeMarkers(specialty){
				// console.log("in place markers" + specialty);
				// console.log(markers[specialty].length);
				for(var i=0; i<markers[specialty].length; i++){
			        markers[specialty][i].setMap(map);
			        masterMarkers.push(markers[specialty][i]);
			    }
			}

	    };
	};

	app.controller("MainController", MainController);
}());