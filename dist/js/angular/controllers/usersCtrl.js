appControllers.controller('usersCtrl', ['$scope','$http','userService','ngTableParams',function UsersCtrl($scope,$http,userService,ngTableParams) {


	$scope.langs = [];
	$scope.gender = {};
	$scope.gender.male = true;
	$scope.gender.female = true;
	$scope.os = {};
	$scope.os.ios = true;
	$scope.os.android = true;
  $scope.totalUsers = 0;


//Creation du  tableau des utilisateurs
userService.fetch().then(function(res) {
  $scope.totalUsers = res.length

  for (var i = 0; i < res.length; i++){
    if (res[i].notification 
     && res[i].notification.lang 
     && $scope.langs.indexOf(res[i].notification.lang.toUpperCase()) == -1){
     $scope.langs.push(res[i].notification.lang.toUpperCase());
 }
}
$scope.lang = $scope.langs[0];
$scope.users = res;
})

$scope.today = function() {
  $scope.dt = new Date(2015,8,1);
};
$scope.today();
$scope.mindDate = new Date(2015,8,1);

$scope.clear = function () {
  $scope.dt = null;
};

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  //$scope.toggleMin();
  $scope.maxDate = new Date(2020, 5, 22);

  $scope.open = function($event) {
    $scope.status.opened = true;
  };

  $scope.setDate = function(dt) {
    $scope.dt = new Date(dt);
    console.log("selected date is "+dt);
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  $scope.status = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  $scope.events =
  [
  {
    date: tomorrow,
    status: 'full'
  },
  {
    date: afterTomorrow,
    status: 'partially'
  }
  ];

  $scope.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i=0;i<$scope.events.length;i++){
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };


  $scope.genderFilter = function (user) {
    return (($scope.gender.male && user.facebook.gender == 'male') || ($scope.gender.female && user.facebook.gender == 'female'));
  }
  $scope.langFilter = function (user) {
    return user.notification && user.notification.lang && ($scope.lang.toLowerCase() == user.notification.lang);
  }
  $scope.osFilter = function (user) {
    // console.log(user.notification);
    // console.log( user.notification && user.notification.platform && ($scope.os.ios && user.notification.platform.toLowerCase() == 'ios'))
    return user.notification && user.notification.platform && (($scope.os.ios && user.notification.platform.toLowerCase() == 'ios') || ($scope.os.android && user.notification.platform.toLowerCase() == 'android'));
  }
   $scope.activeFilter = function (user) {
    // console.log(user.notification);
    // console.log( user.notification && user.notification.platform && ($scope.os.ios && user.notification.platform.toLowerCase() == 'ios'))
    return (new Date(user.last_connected_at)) >= (new Date($scope.dt));
  }

}]);

appControllers.directive('pieChart',['userService','chainService',
 function (userService,chainService) {
   return {
     restrict: 'E',
     replace:true,
     scope: {
      total:'=',
      selected:'='
    },
    template: '<div id="chartpie" style="min-width: 100px; height: 100px; margin: 0 auto"></div>',
    link: function (scope, element, attrs) {

      var chart = false;

                    // for (var i = 0 ; i < res.length ; i++){
                    //     if (res[i]._id == "PRIVATE"){
                    //         res[i].color = "#4A4A4A";
                    //     }else if (res[i]._id == "PUBLIC"){
                    //         res[i].color = "#00E1CD";
                    //     }
                    // }
                    console.log(parseInt(scope.total-scope.selected));
                    console.log(scope.selected);
                    var initChart = function() {
                      var res = [{title:"Restants",count:parseInt(scope.total-scope.selected),color:"#4A4A4A"},{title:"Sélectionnés",count:scope.selected,color : "#00E1CD"}];
                      if (chart) chart.destroy();
                      var config = scope.config || {};
                      chart = AmCharts.makeChart("chartpie", {
                        "type": "pie",
                        "theme": "light",
                        "dataProvider": res,
                        "titleField": "title",
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
                    scope.$watch('selected', function(newValue, oldValue) {
                      if (newValue)
                        initChart();
                    }, true);


                  }         
                }
              }]);