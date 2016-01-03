appControllers.controller('geolocCtrl', ['$scope','$http','userService','subscriberService','facebookService','twitterService','instagramService','eventService','chainService','NgMap',function GeolocCtrl($scope,$http,userService,subscriberService,facebookService,twitterService,instagramService,eventService,chainService,NgMap) {


chainService.fetch().then(function(res){
    NgMap.getMap().then(function(map) {
        var markers = [];
        var infowindows = [];
        console.log(res);
        for (var i = 0; i < res.length; i++) {
            if (res[i].author && res[i].author.location){
                infowindows[i] = new google.maps.InfoWindow();
                markers[i] = new google.maps.Marker({ title: "Chain #" + res[i].title });
                var lat = res[i].author.location.latitude;
                var lng = res[i].author.location.longitude;
                var loc = new google.maps.LatLng(lat, lng);
                var contentString = '<div id="content">'+
                  '<div id="siteNotice">'+
                  '</div>'+
                  '<h2 id="firstHeading" class="firstHeading">#'+res[i].title+'</h2>'+
                  '<div id="bodyContent">'+
                  '<img src="'+res[i].thumbnail_base_s3_url+res[i].author.thumbnails[0]+'" width="100" height="100"></img>'+
                  '</div>'+
                  '</div>';
                   infowindows[i].setContent(contentString);
                google.maps.event.addListener(markers[i], 'click', function(innerKey) {
                  return function() {

                      infowindows[innerKey].open(map, markers[innerKey]);
                     

                      for (var j = 0 ; j < res[innerKey].chainers.length ; j++){
                        var chainLinks = [
                          {lat: res[innerKey].author.location.latitude, lng: res[innerKey].author.location.longitude}
                        ];
                        chainLinks.push({lat: res[innerKey].chainers[j].location.latitude, lng: res[innerKey].chainers[j].location.longitude});
                        var chainLink = new google.maps.Polyline({
                          path: chainLinks,
                          geodesic: true,
                          strokeColor: '#FF0000',
                          strokeOpacity: 1.0,
                          strokeWeight: 2
                        });

                        chainLink.setMap(map);
                      }
                      
                  }
                }(i));
                // if (res[i].status == "ACTIVE"){
                //     markers[i].setAnimation(google.maps.Animation.BOUNCE)
                // }
                markers[i].setPosition(loc);
                markers[i].setMap(map);
            }
        }
      }, 1000);
})

	
}]);
