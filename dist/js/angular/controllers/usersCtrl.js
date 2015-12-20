appControllers.controller('usersCtrl', ['$scope','$http','userService','ngTableParams',function UsersCtrl($scope,$http,userService,ngTableParams) {


	$scope.langs = [];
	$scope.gender = {};
	$scope.gender.male = true;
	$scope.gender.female = true;
	$scope.os = {};
	$scope.os.ios = true;
	$scope.os.android = true;


//Creation du  tableau des utilisateurs
    userService.fetch().then(function(res) {

    	for (var i = 0; i < res.length; i++){
    		if (res[i].notification 
    			&& res[i].notification.lang 
    			&& $scope.langs.indexOf(res[i].notification.lang.toUpperCase()) == -1){
    			$scope.langs.push(res[i].notification.lang.toUpperCase());
    		}
    	}
    	$scope.lang = $scope.langs[0];
        $scope.users = res;
        $scope.tableParams = new ngTableParams({
	        page: 1,            // show first page
	        count: 10           // count per page
	    }, {
	        total: res.length, // length of data
	        getData: function($defer, params) {
	            $defer.resolve(res.slice((params.page() - 1) * params.count(), params.page() * params.count()));
	        }
	    });
    })

    $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

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
  $scope.toggleMin();
  $scope.maxDate = new Date(2020, 5, 22);

  $scope.open = function($event) {
    $scope.status.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
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

		return user.notification && (($scope.os.ios && user.notification.platform == 'ios') || ($scope.os.android && user.notification.platform == 'android'));
	}

}]);