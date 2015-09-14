appControllers.controller('chainsCtrl', ['$scope','$http','chainService','ngTableParams','$filter',function ChainsCtrl($scope,$http,chainService,ngTableParams,$filter) {





//Creation du  tableau des chains
    chainService.fetch().then(function(res) {
    	$scope.type = "(Tout)";

        $scope.chains = res;
        console.log('chains total is '+res.length)
        $scope.tableParams = new ngTableParams({
	        page: 1,            // show first page
	        count: 10,
	        sorting: {
            	created_at: 'desc'     // initial sorting
        	}          // count per page
	    }, {
	        total: res.length, // length of data
	        getData: function($defer, params) {
	        	var orderedData = params.sorting ?
                        $filter('orderBy')(res, params.orderBy()) : res;
                orderedData = params.filter ?
                        $filter('filter')(orderedData, params.filter()) : orderedData;
	            $scope.chains = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
	       		$defer.resolve($scope.chains);
	        }
	    });
    })

    $scope.filterTypes = function(chain){
    	if ($scope.type = "(Tout)"){
    		return chain;
    	}else{
    		return (chain.type == $scope.type);
    	}
    }

}]);