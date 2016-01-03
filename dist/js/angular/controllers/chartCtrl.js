appControllers.controller('chartCtrl', ['$scope','$http','userService','subscriberService','facebookService','twitterService','instagramService','eventService','chainService','NgMap',function ChartCtrl($scope,$http,userService,subscriberService,facebookService,twitterService,instagramService,eventService,chainService,NgMap) {

$scope.title="Insights";
// var salesChartCanvas = document.getElementById("salesChart").getContext("2d");
// var salesChart = new Chart(salesChartCanvas);
// var usersGrowthChartCanvas = document.getElementById("usersGrowthChart").getContext("2d");
// var usersGrowthChart = new Chart(usersGrowthChartCanvas);
// var typeChartCanvas = document.getElementById("typeChart").getContext("2d");
// var typeChart = new Chart(typeChartCanvas);
$scope.events = [];

$scope.dataAmCharts = null;

twitterService.followersCount().then(function(res){

    $scope.twFollowers = res.count;
})


facebookService.likesCount().then(function(res){

    $scope.fbLikes = res.likes;
})


eventService.fetch().then(function(res){

    $scope.events = res;
})

userService.runningUsers().then(function(res){




    console.log(res);
    var usersGrowthData = [];
    var usersGrowthLabels = [];
    var percentGrowth = 0;
    for (var i = 0 ; i < res.length ; i++){

        if (i>0){
            percentGrowth+=parseFloat(((res[i].users-res[i-1].users)*100/res[res.length-1].users).toFixed(2));
            usersGrowthData.push(((res[i].users-res[i-1].users)*100/res[res.length-1].users).toFixed(2));
        }else{
            usersGrowthData.push(0);
        }
        usersGrowthLabels.push(res[i].date);
    }
    $scope.percentGrowth = (percentGrowth / res.length).toFixed(2);

        //usersGrowthChart.Line(usersGrowth, usersGrowthOptions);
})

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
                  '<h1 id="firstHeading" class="firstHeading">#'+res[i].title+'</h1>'+
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
                
                markers[i].setPosition(loc);
                markers[i].setMap(map);
            }
        }
      }, 1000);
})

$scope.getEventClass = function(index){
console.log("inde getEventClass")
   if (index % 2 == 0){
     console.log("is even"); 
     return "timeline";
   }
   return "timeline-inverted";

}

//Creation du  graphique des nouveaux utilisateurs par jour
userService.newUsersByDay().then(function(res){

	// console.log(res);

    var labels = [];
    var dataSetUsers = [];
    var  sum = 0;

    function compare(a,b) {
        if (a._id < b._id)
            return -1;
        if (a._id > b._id)
            return 1;
        return 0;
    }

    res.sort(compare);
    
    $scope.dataAmCharts = [];

    for (var i = 0 ; i < res.length; i++){
        labels.push(res[i]._id.substring(0,10));
        dataSetUsers.push(res[i].count);
        sum += parseInt(res[i].count);
        $scope.dataAmCharts.push({"date":res[i]._id.substring(0,10),"count":res[i].count});
    }
    $scope.usersCount = sum;
    $scope.facefighters = sum;

    chainService.newChainsByDay().then(function(chains){
        var labelsChain = [];
        var dataSetChains = [];
        var  sumChains = 0;

        for (var i = 0 ; i < chains.length; i++){
            labelsChain.push(chains[i]._id.substring(0,10));
            dataSetChains.push(chains[i].count);
            sumChains += parseInt(chains[i].count);
        }
        chainService.newChainsV2ByDay().then(function(chainsv2){
            var labelsChain = [];
            var dataSetChains = [];

            // console.log(chains)

            for (var i = 0 ; i < chainsv2.length; i++){
                sumChains += parseInt(chainsv2[i].count);
            }

            $scope.chains = sumChains;


            chainService.chainersByChain().then(function(res){
                console.log(res);
                //$scope.chainersByChain = res;
                var sum = 0;
                for (var i = 0 ; i < res.length ; i++){
                    sum+=(res[i].frequency * (res[i].chainers+1));
                }
                $scope.chainersByChain = (parseFloat((sum / $scope.chains))).toFixed(2);
            });

            chainService.chainsByChainer().then(function(res){
                console.log(res);
                //$scope.chainersByChain = res;
                var sum = 0;
                for (var i = 0 ; i < res.length ; i++){
                    sum+=(res[i].count);
                }
                $scope.chainsByChainer = (parseFloat((sum / $scope.usersCount))).toFixed(2);
            });

            chainService.topChainers().then(function(res){
                $scope.topChainers = res.slice(0,5);
                //$scope.chainersByChain = res;
                console.log($scope.topChainers);
            });
        })

        
    })

    //Create the line chart
    

        



	})
	
}]);

appControllers.directive('lineChart',['userService','chainService',
   function (userService,chainService) {
       return {
           restrict: 'E',
           replace:true,
           scope: {
                // bi directional binding will pass data array to isolated scope
                data: '=',
                title: '@'
            },
           template: '<div id="chartdiv" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
           link: function (scope, element, attrs) {

                var chart = false;

                userService.newUsersByDay().then(function(res){

                    function compare(a,b) {
                        if (a._id < b._id)
                            return -1;
                        if (a._id > b._id)
                            return 1;
                        return 0;
                    }

                    res.sort(compare);
                    
                    var dataAmCharts = [];
                    var labels = [];
                    var dataSetUsers = [];

                    for (var i = 0 ; i < res.length; i++){
                        labels.push(res[i]._id.substring(0,10));
                        dataSetUsers.push(res[i].count);
                        //dataAmCharts.push({"date":res[i]._id.substring(0,10),"count":res[i].count});
                    }

                    chainService.newChainsByDay().then(function(chains){
                        var labelsChain = [];
                        var dataSetChains = [];


                        for (var i = 0 ; i < chains.length; i++){
                            labelsChain.push(chains[i]._id.substring(0,10));
                            dataSetChains.push(chains[i].count);
                            //sumChains += parseInt(chains[i].count);
                        }

                        chainService.newChainsV2ByDay().then(function(chainsv2){
                        var labelsChainV2 = [];
                        var dataSetChainsV2 = [];

                            for (var i = 0 ; i < chainsv2.length; i++){
                                labelsChainV2.push(chainsv2[i]._id.substring(0,10));
                                dataSetChainsV2.push(chainsv2[i].count);
                                //sumChains += parseInt(chains[i].count);
                            }

                            var arrayUnique = function(a) {
                                return a.reduce(function(p, c) {
                                    if (p.indexOf(c) < 0) p.push(c);
                                    return p;
                                }, []);
                            };

                            var definitiveLabels = labels.sort().concat(labelsChain.sort()).concat(labelsChainV2.sort()).sort();
                            var uniqueLabels = arrayUnique(definitiveLabels);
                            var longerLabels = [];
                            var dataUsers = [];
                            var dataChains = [];
                            var dataChainsv2 = [];

                                for (var i = 0 ; i < uniqueLabels.length ; i++){
                                    var dataToPush = {};
                                    dataToPush.date = uniqueLabels[i];
                                    if (labels.indexOf(uniqueLabels[i])!=-1){
                                        dataToPush.users = dataSetUsers[labels.indexOf(uniqueLabels[i])];
                                        dataUsers.push(dataSetUsers[labels.indexOf(uniqueLabels[i])]);
                                    }else{
                                        dataToPush.users = dataSetUsers[labels.indexOf(uniqueLabels[i])];
                                        dataUsers.push(0);
                                    }
                                    if (labelsChain.indexOf(uniqueLabels[i])!=-1){
                                        dataToPush.chains = dataSetChains[labelsChain.indexOf(uniqueLabels[i])];
                                        dataChains.push(dataSetChains[labelsChain.indexOf(uniqueLabels[i])]);
                                    }else{
                                        dataToPush.chains += 0;
                                        dataChains.push(0);
                                    }
                                    if (labelsChainV2.indexOf(uniqueLabels[i])!=-1){
                                        dataToPush.chains = dataSetChainsV2[labelsChainV2.indexOf(uniqueLabels[i])];
                                        dataChains.push(dataSetChainsV2[labelsChainV2.indexOf(uniqueLabels[i])]);
                                    }else{
                                        dataToPush.chains += 0;
                                        dataChains.push(0);
                                    }
                                    dataAmCharts.push(dataToPush);
                                }

                    var initChart = function() {
                      if (chart) chart.destroy();
                      var config = scope.config || {};
                       chart = AmCharts.makeChart("chartdiv", {
                            "type": "serial",
                            "theme": "light",
                            "marginLeft": 20,
                            "pathToImages": "http://www.amcharts.com/lib/3/images/",
                            "dataProvider": dataAmCharts,
                            "legend": {
                                "useGraphSettings": true
                            },
                            "valueAxes": [{
                                "id": "v1",
                                "axisAlpha": 0,
                                "inside": true,
                                "position": "left",
                                "ignoreAxisWidth": true
                            },{
                                "id": "v2",
                                "axisAlpha": 0,
                                "inside": true,
                                "position": "right",
                                "ignoreAxisWidth": true
                            }],
                            "graphs": [{
                                "balloonText": "[[category]]<br><b><span style='font-size:10px;'>Utilisateurs : [[value]]</span></b>",
                                "bullet": "round",
                                "bulletSize": 4,
                                "lineColor": "#00E1CD",
                                "lineThickness": 2,
                                "negativeLineColor": "#00E1CD",
                                "type": "smoothedLine",
                                "valueField": "users",
                                "valueAxes": "v1",
                                "title" : "Utilisateurs"
                            },{
                                "balloonText": "[[category]]<br><b><span style='font-size:10px;'>Chains : [[value]]</span></b>",
                                "bullet": "round",
                                "bulletSize": 4,
                                "lineColor": "#4A4A4A",
                                "lineThickness": 2,
                                "negativeLineColor": "#4A4A4A",
                                "type": "smoothedLine",
                                "valueField": "chains",
                                "valueAxes": "v2",
                                "title" : "Chains (v1 & v2)"
                            }],
                            "chartScrollbar": {},
                            "chartCursor": {
                                "categoryBalloonDateFormat": "YYYY-MM-DD",
                                "cursorAlpha": 0,
                                "cursorPosition": "mouse"
                                 
                            },
                            "dataDateFormat": "YYYY-MM-DD",
                            "categoryField": "date",
                            "categoryAxis": {
                                "minPeriod": "DD",
                                "parseDates": true,
                                "minorGridAlpha": 0.1,
                                "minorGridEnabled": true
                            }
                        });


                    };
                    initChart();
                });
                    
                });


                });

                
           }         
       }
   }]);

appControllers.directive('donutChart',['userService','chainService',
   function (userService,chainService) {
       return {
           restrict: 'E',
           replace:true,
           scope: {
                // bi directional binding will pass data array to isolated scope
                data: '=',
                title: '@'
            },
           template: '<div id="chartpie" style="min-width: 210px; height: 300px; margin: 0 auto"></div>',
           link: function (scope, element, attrs) {

                var chart = false;

                chainService.chainsByType().then(function(res){
                    //console.log(res);

                    for (var i = 0 ; i < res.length ; i++){
                        if (res[i]._id == "PRIVATE"){
                            res[i].color = "#4A4A4A";
                        }else if (res[i]._id == "PUBLIC"){
                            res[i].color = "#00E1CD";
                        }
                    }
                    var initChart = function() {
                      if (chart) chart.destroy();
                      var config = scope.config || {};
                       chart = AmCharts.makeChart("chartpie", {
                          "type": "pie",
                          "theme": "light",
                          "titles": [ {
                            "text": "Répartition des chains par type",
                            "size": 16
                          } ],
                          "dataProvider": res,
                          "titleField": "_id",
                          "valueField": "count",
                          "labelRadius": 4,
                          "radius": "42%",
                          "innerRadius": "50%",
                          "labelText": "[[title]]",
                          "colorField": "color",
                          "export": {
                            "enabled": true
                          }
                    });


                    };
                    initChart();
                    
                });


           }         
       }
   }]);

appControllers.directive('areaChart',['userService','chainService',
   function (userService,chainService) {
       return {
           restrict: 'E',
           replace:true,
           scope: {
                // bi directional binding will pass data array to isolated scope
                data: '=',
                title: '@'
            },
           template: '<div id="chartarea" style="min-width: 210px; height: 300px; margin: 0 auto"></div>',
           link: function (scope, element, attrs) {

                var chart = false;

                userService.runningUsers().then(function(res){

                    var usersGrowthData = [];
                    var usersGrowthLabels = [];
                    // var percentGrowth = 0;
                    // for (var i = 0 ; i < res.length ; i++){

                    //     if (i>0){
                    //         percentGrowth+=parseFloat(((res[i].users-res[i-1].users)*100/res[res.length-1].users).toFixed(2));
                    //         usersGrowthData.push(((res[i].users-res[i-1].users)*100/res[res.length-1].users).toFixed(2));
                    //     }else{
                    //         usersGrowthData.push(0);
                    //     }
                    //     usersGrowthLabels.push(res[i].date);
                    // }

                    var initChart = function() {
                      if (chart) chart.destroy();
                      var config = scope.config || {};
                       chart = AmCharts.makeChart("chartarea", {
                            "type": "serial",
                            "theme": "light",
                            "dataProvider": res,
                            "valueAxes": [{
                                "position": "left"
                            }],
                            "graphs": [{
                                "id": "g1",
                                "fillAlphas": 0.4,
                                "valueField": "users",
                                 "balloonText": "<div style='margin:5px; font-size:10px;'>Utilisateurs:<b>[[value]]</b></div>",
                                 "color": "#00E1CD",
                                 "fillColors": "#00E1CD"
                            }],
                            "chartScrollbar": {},
                            "chartCursor": {
                                "categoryBalloonDateFormat": "YYYY-MM-DD",
                                "cursorPosition": "mouse"
                            },
                            "categoryField": "date",
                            "categoryAxis": {
                                "minPeriod": "DD",
                                "parseDates": true
                            },
                            "export": {
                                "enabled": true
                            }
                        });


                    };
                    initChart();
                    
                });


           }         
       }
   }]);

appControllers.directive('mixedChart',['userService','chainService',
   function (userService,chainService) {
       return {
           restrict: 'E',
           replace:true,
           scope: {
                // bi directional binding will pass data array to isolated scope
                title: '@'
            },
           template: '<div id="chartau" style="min-width: 210px; height: 300px; margin: 0 auto"></div>',
           link: function (scope, element, attrs) {

                var chart = false;

                userService.activeUsers().then(function(res){

                    var initChart = function() {
                      if (chart) chart.destroy();
                      var config = scope.config || {};
                       chart = AmCharts.makeChart("chartau", {
                            "type": "serial",
                            "theme": "light",
                            "dataProvider": res,
                            "dataDateFormat" : "YYYY-MM-DD JJ:NN:SS",
                            "valueAxes": [{
                                "axisAlpha": 0.1
                            }],
                            "graphs": [{
                                "balloonText": "Utilisateurs: [[value]]",
                                "columnWidth": 20,
                                "fillAlphas": 1,
                                "title": "daily",
                                "type": "column",
                                "valueField": "daily",
                                "lineColor" :  "#00E1CD"
                            }, {
                                "balloonText": "Utilisateurs: [[value]]",
                                "lineThickness": 2,
                                "title": "intra-day",
                                "valueField": "hourly",
                                "lineColor": "#4A4A4A"
                            }],
                            "chartScrollbar": {},
                            "zoomOutButtonRollOverAlpha": 0.15,
                            "chartCursor": {
                                "categoryBalloonDateFormat": "MMM DD JJ:NN",
                                "cursorPosition": "mouse",
                                "showNextAvailable": true
                            },
                            "autoMarginOffset": 5,
                            "columnWidth": 1,
                            "categoryField": "date",
                            "categoryAxis": {
                                "minPeriod": "hh",
                                "parseDates": true
                            },
                            "export": {
                                "enabled": true
                            }
                        });


                    };
                    initChart();
                    
                });


           }         
       }
   }]);
