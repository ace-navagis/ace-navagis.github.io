function initMap() {
	//infoBox plugin
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = "js/infobox.js";
	$("head").append(s);

	var data = [];
	var compiledData = [];
	var markers = [];
	var loading = true;
	var placesTypes = [];
	var currentSearch;
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
	var masterPlaces;
	var map;
	var getPlaces;
	var directionsService;
	var directionsDisplay;
	var placesService;
	var infowindow;
	var drawingManager;
	var cebuLatLng = new google.maps.LatLng(10.3226903, 123.8975747);
	var circleCenter = new google.maps.LatLng(10.590268, 124.375957);

	function handleLocationError(browserHasGeolocation) {
	    window.alert(browserHasGeolocation ?
	                          'Error: The Geolocation service failed.' :
	                          'Error: Your browser doesn\'t support geolocation.');
	}

	function loadMap() {
		$(document).ready(function(){
           	$('#details-panel').addClass('hidden');
        });

		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 10,
			center: cebuLatLng,
			mapTypeId: 'hybrid'
		});

		infowindow = new google.maps.InfoWindow();
		placesService = new google.maps.places.PlacesService(map);
		directionsService = new google.maps.DirectionsService();
		directionsDisplay = new google.maps.DirectionsRenderer();
		directionsDisplay.setMap(map);
		drawingManager = new google.maps.drawing.DrawingManager({
			drawingControl: true,
			drawingControlOptions: {
				position: google.maps.ControlPosition.TOP_CENTER,
				drawingModes: ['circle']
			},
			circleOptions: {
				fillColor: 'transparent',
				fillOpacity: 1,
				strokeWeight: 3,
				strokeColor: '#2967de',
				clickable: false,
				editable: true,
				draggable: true,
				zIndex: 1
			}
	    });
	    drawingManager.setMap(map);

	    google.maps.event.addListener(drawingManager, 'circlecomplete', function (event) {

	        // Get circle center and radius
	        var center = event.getCenter();
	        var radius = event.getRadius();

	        // Remove overlay from map
	        event.setMap(null);
	        drawingManager.setDrawingMode(null);

	        // Create circle
	        createCircle(center, radius);
	    });

	    function createCircle(center, radius) {

		   var circleLabel;
		   var circle = new google.maps.Circle({
		        fillColor: 'transparent',
		        fillOpacity: 1,
		        strokeWeight: 3,
		        strokeColor: '#2967de',
		        draggable: true,
		        editable: true,
		        map: map,
		        center: center,
		        radius: radius
		    });

		   var counter = 0;
			for (var i = 0; i < markers.length; i++) {
				if (circle.getBounds().contains(markers[i].getPosition())) {
					counter++;
				}
			}
		   var labelOptions = {
				content: counter.toString(),
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
				position: circle.getCenter(),
				closeBoxURL: "",
				isHidden: false,
				pane: "floatPane",
				enableEventPropagation: true
			};

			circleLabel = new InfoBox(labelOptions);
			circleLabel.open(map);

		    google.maps.event.addListener(circle, 'radius_changed', function (event) {

		    	if(circleLabel){
	                circleLabel.close();
	            }

		        var counter = 0;
		        for (var i = 0; i < markers.length; i++) {
					if (circle.getBounds().contains(markers[i].getPosition())) {
						counter++;
					}
				}

				var labelOptions = {
					content: counter.toString(),
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
					position: circle.getCenter(),
					closeBoxURL: "",
					isHidden: false,
					pane: "floatPane",
					enableEventPropagation: true
				};

				circleLabel = new InfoBox(labelOptions);
				circleLabel.open(map);
		    });

		    google.maps.event.addListener(circle, 'center_changed', function (event) {

		        if(circleLabel){
	                circleLabel.close();
	            }

		        var counter = 0;
		        for (var i = 0; i < markers.length; i++) {
					if (circle.getBounds().contains(markers[i].getPosition())) {
						counter++;
					}
				}

				var labelOptions = {
					content: counter.toString(),
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
					position: circle.getCenter(),
					closeBoxURL: "",
					isHidden: false,
					pane: "floatPane",
					enableEventPropagation: true
				};

				circleLabel = new InfoBox(labelOptions);
				circleLabel.open(map);
		    });
		}

		function getResponse(results, status, pagination) {
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

		getPlaces = function (type, id) {
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
		};

		function plotRestaurants() {
				var marker;
				markers = [];

				for (var i = 0; i < data.length; i++) {
					marker = new google.maps.Marker({
						position: data[i].geometry.location,
						map: map,
						visited: 0
					});

					google.maps.event.addListener(marker,'click', (function(marker,data,infowindow){
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

					markers.push(marker);
				}

				var markerCluster = new MarkerClusterer(map, markers, { imagePath: 'img/'});

				google.maps.event.addListener(markerCluster, 'clusterclick', function(e) {
				    $(document).ready(function(){
			           	$('#details-panel').addClass('hidden');
			        });
				});

				google.maps.event.addListener(infowindow, 'closeclick', function(e){
					$(document).ready(function(){
			           	$('#details-panel').addClass('hidden');
			        });
				});

				// reset data holders
				// data = [];
				// compiledData = [];
			}

			plotRestaurants();


	}// end loadMap

	loadMap();

	$(document).on("click", "button.get-directions", function(e) {
			console.log('getting directions');
			var destinationLat = $(this).data("lat");
			var destinationLng = $(this).data("lng");
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
		});

	$(document).on("click", "input[type='checkbox']", function(e) {
			if($(this).is(":checked")){
	            getPlaces($(this).val(), $(this).prop("id"));
	        }
	        else if($(this).is(":not(:checked)")){
	            data = [];
	            switch($(this).prop("id")) {
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
				// console.log(data);
				loadMap();
	        }
		});

	$(document).on("click", "a.place-details", function(e) {
			e.preventDefault();
			var request = {
			  placeId: $(this).data("placeid")
			};

			placesService.getDetails(request, callback);

			function callback(place, status) {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					// console.log(place);

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
			}
		});

} // end initMap