appControllers.controller('chartCtrl', ['$scope','$http','userService','subscriberService','facebookService','twitterService','instagramService','eventService',function ChartCtrl($scope,$http,userService,subscriberService,facebookService,twitterService,instagramService,eventService) {

$scope.title="Nouveaux utilisateurs";
var salesChartCanvas = document.getElementById("salesChart").getContext("2d");
var salesChart = new Chart(salesChartCanvas);
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

	var salesChartData = {
		labels: labels.sort(),
		datasets: [
			{
				label: "Users",
				fillColor: "#3a3a3a",
				strokeColor: "#3a3a3a",
				pointColor: "#3a3a3a",
				pointStrokeColor: "#c1c7d1",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgb(220,220,220)",
				data: dataSetUsers
			}
		]
	};
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

    subscriberService.newSubscribersByDay.then(function(sub){
        var labelsSub = [];
        var dataSetSubscribers = [];
        var  sumSub = 0;

        for (var i = 0 ; i < sub.length; i++){
            labelsSub.push(sub[i]._id.substring(0,10));
            dataSetSubscribers.push(sub[i].count);
            sumSub += parseInt(sub[i].count);
        }

        $scope.facesubscribers = sumSub;


        var definitiveLabels = labels.sort().concat(labelsSub.sort());

        $scope.minDate = definitiveLabels[0].substring(0,10);
        $scope.maxDate = definitiveLabels[definitiveLabels.length-1].substring(0,10);

        salesChartData.labels = definitiveLabels.sort();
        salesChartData.datasets.push(
            {
                label: "Facesubscribers",
                fillColor: "#00d584",
                strokeColor: "#00d584",
                pointColor: "#00d584",
                pointStrokeColor: "#c1c7d1",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgb(220,220,220)",
                data: dataSetSubscribers
            }
            );
        salesChart.Line(salesChartData, salesChartOptions);
    })

    //Create the line chart
    

        



	})
	
}]);
