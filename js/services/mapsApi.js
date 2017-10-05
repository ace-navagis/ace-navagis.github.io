(function(){
	'use strict';

	var mapsApi = function(){

		var newMap = function(center) {
	        return new google.maps.Map(document.getElementById('map'), {
				zoom: 12,
				center: center
				// mapTypeId: 'hybrid'
			});
	    };

	    var newLatLng = function(lat, lng){
	    	return new google.maps.LatLng(lat, lng);
	    };

	    var newInfoWindow = function(){
	    	return new google.maps.InfoWindow();
	    };

	    var newPlaces = function(map){
	    	return new google.maps.places.PlacesService(map);
	    };

	    var newDirections = function(){
	    	return new google.maps.DirectionsService();
	    };

	    var newDirectionsDisplay = function(){
	    	return new google.maps.DirectionsRenderer();
	    };

	    var newDrawingManager = function(){
	    	return new google.maps.drawing.DrawingManager({
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
	    };

	    var mapAddListener = function(item, event, callback){
	    	google.maps.event.addListener(item, event, callback);
	    };

	    var newCircle = function(center, radius, map){
	    	return new google.maps.Circle({
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
	    };

	    var newMarker = function(location, map){
	    	return new google.maps.Marker({
						position: location,
						map: map,
						visited: 0
					});
	    };

	    return {
	    	newMap: newMap,
	    	newLatLng: newLatLng,
	    	newInfoWindow: newInfoWindow,
	    	newPlaces: newPlaces,
	    	newDirections: newDirections,
	    	newDirectionsDisplay: newDirectionsDisplay,
	    	newDrawingManager: newDrawingManager,
	    	mapAddListener: mapAddListener,
	    	newCircle: newCircle,
	    	newMarker: newMarker
	    };
	};

	var module = angular.module("mapApp");
	module.factory("mapsApi", mapsApi);
}());