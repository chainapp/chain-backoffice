appControllers.controller('chartCtrl', ['$scope','$http','userService','subscriberService','facebookService','twitterService','instagramService','eventService','chainService','NgMap',function ChartCtrl($scope,$http,userService,subscriberService,facebookService,twitterService,instagramService,eventService,chainService,NgMap) {

$scope.title="Insights";
var salesChartCanvas = document.getElementById("salesChart").getContext("2d");
var salesChart = new Chart(salesChartCanvas);
var usersGrowthChartCanvas = document.getElementById("usersGrowthChart").getContext("2d");
var usersGrowthChart = new Chart(usersGrowthChartCanvas);
var typeChartCanvas = document.getElementById("typeChart").getContext("2d");
var typeChart = new Chart(typeChartCanvas);
$scope.events = [];


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
    var usersGrowthOptions = {
        //Boolean - If we should show the scale at all
        showScale: true,
        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: false,
        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",
        //Number - Width of the grid lines
        scaleGridLineWidth: 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,
        //Boolean - Whether the line is curved between points
        bezierCurve: true,
        //Number - Tension of the bezier curve between points
        bezierCurveTension: 0.3,
        //Boolean - Whether to show a dot for each point
        pointDot: false,
        //Number - Radius of each point dot in pixels
        pointDotRadius: 4,
        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 1,
        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius: 20,
        //Boolean - Whether to show a stroke for datasets
        datasetStroke: true,
        //Number - Pixel width of dataset stroke
        datasetStrokeWidth: 2,
        //Boolean - Whether to fill the dataset with a color
        datasetFill: true,
        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%=datasets[i].label%>&#37;</li><%}%></ul>",
        //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio: false,
        //Boolean - whether to make the chart responsive to window resizing
        responsive: true
    };

    var usersGrowth = {
                labels: usersGrowthLabels.sort(),
                datasets: [
                    
                    {
                        label: "Chains",
                        fillColor: "#00E1CD",
                        strokeColor: "#00E1CD",
                        pointColor: "#00E1CD",
                        pointStrokeColor: "#c1c7d1",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgb(220,220,220)",
                        data: usersGrowthData
                    }
                ]
            };


        usersGrowthChart.Line(usersGrowth, usersGrowthOptions);
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

	console.log(res);

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
    

    for (var i = 0 ; i < res.length; i++){
        labels.push(res[i]._id.substring(0,10));
        dataSetUsers.push(res[i].count);
        sum += parseInt(res[i].count);
    }
    $scope.usersCount = sum;
    $scope.facefighters = sum;

    console.log(labels);
    console.log(dataSetUsers);

	
    var salesChartOptions = {
        //Boolean - If we should show the scale at all
        showScale: true,
        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: false,
        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",
        //Number - Width of the grid lines
        scaleGridLineWidth: 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,
        //Boolean - Whether the line is curved between points
        bezierCurve: true,
        //Number - Tension of the bezier curve between points
        bezierCurveTension: 0.3,
        //Boolean - Whether to show a dot for each point
        pointDot: false,
        //Number - Radius of each point dot in pixels
        pointDotRadius: 4,
        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 1,
        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius: 20,
        //Boolean - Whether to show a stroke for datasets
        datasetStroke: true,
        //Number - Pixel width of dataset stroke
        datasetStrokeWidth: 2,
        //Boolean - Whether to fill the dataset with a color
        datasetFill: true,
        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%=datasets[i].label%></li><%}%></ul>",
        //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio: false,
        //Boolean - whether to make the chart responsive to window resizing
        responsive: true
    };

    chainService.newChainsByDay().then(function(chains){
        var labelsChain = [];
        var dataSetChains = [];
        var  sumChains = 0;

        console.log(chains)

        for (var i = 0 ; i < chains.length; i++){
            labelsChain.push(chains[i]._id.substring(0,10));
            dataSetChains.push(chains[i].count);
            sumChains += parseInt(chains[i].count);
        }

        $scope.chains = sumChains;

        var arrayUnique = function(a) {
            return a.reduce(function(p, c) {
                if (p.indexOf(c) < 0) p.push(c);
                return p;
            }, []);
        };

        var definitiveLabels = labels.sort().concat(labelsChain.sort()).sort();
        var uniqueLabels = arrayUnique(definitiveLabels);
        var longerLabels = [];
        var dataUsers = [];
        var dataChains = [];


            for (var i = 0 ; i < uniqueLabels.length ; i++){
                if (labels.indexOf(uniqueLabels[i])!=-1){
                    dataUsers.push(dataSetUsers[labels.indexOf(uniqueLabels[i])]);
                }else{
                    dataUsers.push(0);
                }
                if (labelsChain.indexOf(uniqueLabels[i])!=-1){
                    dataChains.push(dataSetChains[labelsChain.indexOf(uniqueLabels[i])]);
                }else{
                    dataChains.push(0);
                }
            }

            console.log(dataUsers);
            console.log(dataChains);

        // for (var i = 0 ; i < definitiveLabels.length ; i++){
        //     for (var j = 0 ; j < res.length;j++){
        //         if (res[j]._id = definitiveLabels[i]){
        //             dataUsers.push(res[j].count);
        //             break;
        //         }
        //         if (j=res.length-1){
        //             dataUsers.push(0);
        //         }
        //     }
        //     for (var j = 0 ; j < sub.length;j++){
        //         if (sub[j]._id = definitiveLabels[i]){
        //             dataSubscribers.push(sub[j].count);
        //             break;
        //         }
        //         if (j=sub.length-1){
        //             dataSubscribers.push(0);
        //         }
        //     }
        // }

        $scope.minDate = definitiveLabels[0].substring(0,10);
        $scope.maxDate = definitiveLabels[definitiveLabels.length-1].substring(0,10);

                console.log("data users is ");
                console.log(dataSetUsers);

                var salesChartData = {
                labels: uniqueLabels.sort(),
                datasets: [
                    
                    {
                        label: "Chains",
                        fillColor: "#00E1CD",
                        strokeColor: "#00E1CD",
                        pointColor: "#00E1CD",
                        pointStrokeColor: "#c1c7d1",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgb(220,220,220)",
                        data: dataChains
                    },
                    {
                        label: "Users",
                        fillColor: "#4A4A4A",
                        strokeColor: "#4A4A4A",
                        pointColor: "#4A4A4A",
                        pointStrokeColor: "#c1c7d1",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgb(220,220,220)",
                        data: dataUsers
                    }
                ]
            };


        salesChart.Line(salesChartData, salesChartOptions);

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

        chainService.chainsByType().then(function(res){
            console.log(res);

            var pieOptions = {
                //Boolean - Whether we should show a stroke on each segment
                segmentShowStroke : true,

                //String - The colour of each segment stroke
                segmentStrokeColor : "#fff",

                //Number - The width of each segment stroke
                segmentStrokeWidth : 2,

                //Number - The percentage of the chart that we cut out of the middle
                percentageInnerCutout : 50, // This is 0 for Pie charts

                //Number - Amount of animation steps
                animationSteps : 100,

                //String - Animation easing effect
                animationEasing : "easeOutBounce",

                //Boolean - Whether we animate the rotation of the Doughnut
                animateRotate : true,

                //Boolean - Whether we animate scaling the Doughnut from the centre
                animateScale : false,

                //String - A legend template
                legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

            }

            var data = [
            {
                value: res[1].count,
                color:"#00E1CD",
                highlight: "#00E1CD",
                label: res[1]._id + " ("+parseFloat(res[1].count*100/(res[0].count+res[1].count)).toFixed(2)+"%)"
            },
            {
                value: res[0].count,
                color: "#4A4A4A",
                highlight: "#4A4A4A",
                label: res[0]._id + " ("+parseFloat(res[0].count*100/(res[0].count+res[1].count)).toFixed(2)+"%)"
            }];
            //
             typeChart.Pie(data, pieOptions);

            //$scope.chainersByChain = res;
            // var sum = 0;
            // for (var i = 0 ; i < res.length ; i++){
            //     sum+=(res[i].count);
            // }
            // $scope.chainsByChainer = (parseFloat((sum / $scope.usersCount))).toFixed(2);
        });
    })

    //Create the line chart
    

        



	})
	
}]);
