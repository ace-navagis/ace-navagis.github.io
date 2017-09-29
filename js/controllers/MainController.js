(function(){
	'use strict';

	var app = angular.module("mapApp");

	var MainController = function($scope, $compile, mapsApi){
		$scope.initialize = function() {
			//infoBox plugin
			var s = document.createElement("script");
			s.type = "text/javascript";
			s.src = "js/infobox.js";
			document.head.appendChild(s);
			//---------------------------------------

			$scope.specialty = {};
			$scope.loading = false;
			$scope.getSpecialty = _getSpecialty;
			$scope.getDirections = _getDirections;
			$scope.getPlaceDetails = _getPlaceDetails;
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
			var directionsService = mapsApi.newDirections();
			var directionsDisplay = mapsApi.newDirectionsDisplay();

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
				directionsDisplay.setMap(map);
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
						if(!masterPlaces) {
							masterPlaces = 	angular.copy(places);
						} else {
							masterPlaces[currentSearch] = places[currentSearch];
						}
						data = [];
						compiledData = [];
						currentSearch = null;
						$(document).ready(function(){
							$('.load-msg').addClass('hidden');
							$('#floating-panel').removeClass('hidden');

						});
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
					                '<a href="" id="place-details" class="place-details" data-placeid="'+ data.place_id + '" ng-click="getPlaceDetails()">See place details</a>' + '</div>' +
					                '<button id="get-directions" class="get-directions" data-lat="' +  data.geometry.location.lat() +
					                '" data-lng="' + data.geometry.location.lng() + '" ng-click="getDirections()">Get Directions</button>' +
					                ' </div>';
					           var compiled = $compile(content)($scope);
					           infowindow.setContent(compiled[0]);
					           infowindow.open(map,marker);
					           map.panTo(marker.getPosition());
					           $(document).ready(function(){
					           		$('#details-panel').addClass('hidden');
					           });
					        };
					    })(marker,data[i],infowindow));

					markers[currentSearch].push(marker);
					masterMarkers.push(marker);
				}

				mapsApi.mapAddListener(infowindow, 'closeclick', function(e){
					$(document).ready(function(){
			           	$('#details-panel').addClass('hidden');
			        });
				});
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
					removeMarkers(specialty);
		    	}
		    }

		    function _removeMarkers(specialty){
			    for(var i=0; i<markers[specialty].length; i++){
			        markers[specialty][i].setMap(null);
			        for(var x=0; x<masterMarkers.length; x++){
			        	if(markers[specialty][i].getPosition().equals(masterMarkers[x].getPosition())){
			        		masterMarkers.splice(masterMarkers.indexOf(masterMarkers[x]), 1);
			        	}
			        }
			    }
			}

			function _placeMarkers(specialty){
				for(var i=0; i<markers[specialty].length; i++){
			        markers[specialty][i].setMap(map);
			        masterMarkers.push(markers[specialty][i]);
			    }
			}

			function handleLocationError(browserHasGeolocation) {
			    window.alert(browserHasGeolocation ?
			                          'Error: The Geolocation service failed.' :
			                          'Error: Your browser doesn\'t support geolocation.');
			}

			function _getDirections(){
				var element = document.getElementById("get-directions");
				var destinationLat = element.attributes['data-lat'].value;
				var destinationLng = element.attributes['data-lng'].value;
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
					var currentLocation = {
					  lat: position.coords.latitude,
					  lng: position.coords.longitude
					};

					directionsService.route({
						  origin: currentLocation.lat +',' + currentLocation.lng,
						  destination: destinationLat + ',' + destinationLng,
						  travelMode: 'DRIVING'
						}, function(response, status) {
						  if (status === 'OK') {
						    directionsDisplay.setDirections(response);
						  } else {
						    window.alert('Directions request failed due to ' + status);
						  }
						});

					}, function() {
							handleLocationError(true);
						});
					} else {
						// Browser doesn't support Geolocation
						handleLocationError(false);
					}
			}

			function _getPlaceDetails(){
				var element = document.getElementById("place-details");
				var request = {
				  placeId: element.attributes['data-placeid'].value
				};

				placesService.getDetails(request, function(place, status) {
					if (status == google.maps.places.PlacesServiceStatus.OK) {

						var infotxt = '<div class="info-name">' + place.name + '</div>' +
										'<div class="info-rating">' + (place.rating ? 'Rating: <span>' + place.rating + '</span> out of 5' : "Not rated yet.") + '</div>' +
										'<div class="info-address">' + place.formatted_address + '</div>' +
										'<div class="info-phone"> Phone: ' + (place.formatted_phone_number ? place.formatted_phone_number : 'Not available.') + '</div>' +
										'<div id="chartContainer"></div>';
						if(place.opening_hours) {
							var infoscheds = '<div class="infosched-block">';
							for(var x = 0; x < place.opening_hours.weekday_text.length; x++) {
								infoscheds = infoscheds.concat('<div><span class="circle-bullet"></span>' + place.opening_hours.weekday_text[x] + '</div>');
							}
							infoscheds = infoscheds.concat('</div>');

							var openhrs =  '<div class="sched-text"><p>Schedules:</p>' + '' + '</div>';
							var openstatus = '<div class="open-status">' + (place.opening_hours.open_now ? 'Currently open.' : 'Currently closed.') + '</div>';
							infotxt = infotxt.concat(openhrs);
							infotxt = infotxt.concat(infoscheds);
							infotxt = infotxt.concat(openstatus);
						}

						if(place.reviews) {
							var reviewinfo = '<div class="reviewinfo-group"><p>Customer Reviews:</p>';
							for(var i = 0; i < place.reviews.length; i++) {
								reviewinfo = reviewinfo.concat('<div class="review-block">' +
											'<div class="rname">' +  place.reviews[i].author_name +'</div>' +
											'<div class="rtext">' +  (place.reviews[i].text ? '"' + place.reviews[i].text + '"' : place.reviews[i].text) +'</div>' +
											'<div class="rrating">Rating: ' +  place.reviews[i].rating +' out of 5.</div>' +
								'</div>');
							}
							reviewinfo = reviewinfo.concat('</div>');
							infotxt = infotxt.concat(reviewinfo);
						}

						$('#details-panel').empty();
						$('#details-panel').append(infotxt);
						$('#details-panel').scrollTop(20);
						setTimeout(function() {
					        $('#details-panel').scrollTop(0);
					    }, 15);
					    FusionCharts.ready(function(){
						    var revenueChart = new FusionCharts({
						        "type": "column2d",
						        "renderAt": "chartContainer",
						        "width": "300",
						        "height": "300",
						        "dataFormat": "json",
						        "dataSource":  {
						          "chart": {
						            "caption": "Monthly revenue for last year",
						            // "subCaption": place.name,
						            "xAxisName": "Month",
						            // "yAxisName": "Revenues (In PHP)",
						            "theme": "fint"
						         },
						         "data": [
						            {
						               "label": "Jan",
						               "value": Math.floor(Math.random() * (850000 - 400000 + 1) ) + 400000
						            },
						            {
						               "label": "Feb",
						               "value": Math.floor(Math.random() * (850000 - 400000 + 1) ) + 400000
						            },
						            {
						               "label": "Mar",
						               "value": Math.floor(Math.random() * (850000 - 400000 + 1) ) + 400000
						            },
						            {
						               "label": "Apr",
						               "value": Math.floor(Math.random() * (850000 - 400000 + 1) ) + 400000
						            },
						            {
						               "label": "May",
						               "value": Math.floor(Math.random() * (850000 - 400000 + 1) ) + 400000
						            },
						            {
						               "label": "Jun",
						               "value": Math.floor(Math.random() * (850000 - 400000 + 1) ) + 400000
						            },
						            {
						               "label": "Jul",
						               "value": Math.floor(Math.random() * (850000 - 400000 + 1) ) + 400000
						            },
						            {
						               "label": "Aug",
						               "value": Math.floor(Math.random() * (850000 - 400000 + 1) ) + 400000
						            },
						            {
						               "label": "Sep",
						               "value": Math.floor(Math.random() * (850000 - 400000 + 1) ) + 400000
						            },
						            {
						               "label": "Oct",
						               "value": Math.floor(Math.random() * (850000 - 400000 + 1) ) + 400000
						            },
						            {
						               "label": "Nov",
						               "value": Math.floor(Math.random() * (850000 - 400000 + 1) ) + 400000
						            },
						            {
						               "label": "Dec",
						               "value": Math.floor(Math.random() * (850000 - 400000 + 1) ) + 400000
						            }
						         ]
						     }

						  });
						revenueChart.render();
						});
						$('#details-panel').removeClass('hidden');

					} else {
						console.log("No details for this place.");
					}
				});

			}

	    };
	};

	app.controller("MainController", MainController);
}());