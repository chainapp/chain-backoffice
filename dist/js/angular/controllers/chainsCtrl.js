appControllers.controller('chainsCtrl', ['$scope','$http','chainService','ngTableParams','$filter','$timeout',function ChainsCtrl($scope,$http,chainService,ngTableParams,$filter,$timeout) {



$scope.alerts = [];

//Creation du  tableau des chains

$scope.init = function(){
    chainService.fetch().then(function(res) {
    	$scope.type = "(Tout)";

        $scope.chains = res;
        console.log('chains total is '+res.length)
        $scope.tableParams = new ngTableParams({
	        page: 1,            // show first page
	        count: 100,
	        sorting: {
            	created_at: 'desc'     // initial sorting
        	}          // count per page
	    }, {
	        total: $scope.chains.length, // length of data
	        getData: function($defer, params) {
	        	var orderedData = params.sorting ?
                        $filter('orderBy')($scope.chains, params.orderBy()) : $scope.chains;
                orderedData = params.filter ?
                        $filter('filter')(orderedData, params.filter()) : orderedData;
	            $scope.chains = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
	       		$defer.resolve($scope.chains);
	        }
	    });
    })
}
$scope.init();

    $scope.delete = function(chain){
        console.log("deleting chain "+chain.title);
        
        chainService.delete(chain._id).then(function(res){
            $scope.alerts.push({title:'#'+chain.title});
            $timeout(function(){ $scope.alerts.splice(0,1);console.log("timeout"); }, 3000);
            $scope.init();
        })
    }

    $scope.filterTypes = function(chain){
    	if ($scope.type == "(Tout)"){
    		return chain;
    	}else{
    		return (chain.type == $scope.type);
    	}
    }

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };

}]);