appControllers.controller('chartCtrl', ['$scope','$http','userService','facebookService','twitterService','instagramService',function ChartCtrl($scope,$http,userService,facebookService,twitterService,instagramService) {

$scope.title="Nouveaux utilisateurs";
var salesChartCanvas = document.getElementById("salesChart").getContext("2d");
var salesChart = new Chart(salesChartCanvas);



twitterService.followersCount().then(function(res){

    $scope.twFollowers = res.count;
})


facebookService.likesCount().then(function(res){

    $scope.fbLikes = res.likes;
})




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
    $scope.minDate = res[0]._id.substring(0,10);
    $scope.maxDate = res[res.length-1]._id.substring(0,10);

    for (var i = 0 ; i < res.length; i++){
        labels.push(res[i]._id.substring(0,10));
        dataSetUsers.push(res[i].count);
        sum += parseInt(res[i].count);
    }
    $scope.usersCount = sum;

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

    //Create the line chart
    salesChart.Line(salesChartData, salesChartOptions);

	})
	
}]);