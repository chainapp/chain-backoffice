appControllers.controller('geolocCtrl', ['$scope','$http','userService','subscriberService','facebookService','twitterService','instagramService','eventService','chainService','NgMap',function GeolocCtrl($scope,$http,userService,subscriberService,facebookService,twitterService,instagramService,eventService,chainService,NgMap) {


chainService.fetch().then(function(res){
    NgMap.getMap().then(function(map) {
        var markers = [];
        var infowindows = [];
        for (var i = 0; i < res.length; i++) {
            if (res[i].location){
                infowindows[i] = new google.maps.InfoWindow();
                markers[i] = new google.maps.Marker({ title: "Chain #" + res[i].title });
                var lat = res[i].location.latitude;
                var lng = res[i].location.longitude;
                var loc = new google.maps.LatLng(lat, lng);
                var contentString = '<div id="content">'+
                  '<div id="siteNotice">'+
                  '</div>'+
                  '<h2 id="firstHeading" class="firstHeading">#'+res[i].title+'</h2>'+
                  '<div id="bodyContent">'+
                  '<img src="'+res[i].current_picture_s3_url+'" width="100" height="100"></img>'+
                  '</div>'+
                  '</div>';
                   infowindows[i].setContent(contentString);
                google.maps.event.addListener(markers[i], 'click', function(innerKey) {
                  return function() {

                      infowindows[innerKey].open(map, markers[innerKey]);
                  }
                }(i));
                if (res[i].status == "ACTIVE"){
                    markers[i].setAnimation(google.maps.Animation.BOUNCE)
                }
                markers[i].setPosition(loc);
                markers[i].setMap(map);
            }
        }
      }, 1000);
})

	
}]);
