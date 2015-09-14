appControllers.controller('usersCtrl', ['$scope','$http','userService','ngTableParams',function UsersCtrl($scope,$http,userService,ngTableParams) {





//Creation du  tableau des utilisateurs
    userService.fetch().then(function(res) {

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

}]);