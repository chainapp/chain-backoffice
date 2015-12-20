appControllers.controller('chainsCtrl', ['$scope','$http','chainService','ngTableParams','$filter','$timeout','$uibModal',function ChainsCtrl($scope,$http,chainService,ngTableParams,$filter,$timeout,$uibModal) {



$scope.alerts = [];
$scope.display = false;

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
        if (confirm("Etes-vous sûr de vouloir supprimer la chain "+chain.title+" ?")){
            chainService.delete(chain._id).then(function(res){
                $scope.alerts.push({title:'Chain #'+chain.title+" has been successfully deleted !"});
                $timeout(function(){ $scope.alerts.splice(0,1);console.log("timeout"); }, 3000);
                $scope.init();
            })
        }
    }

    $scope.changeType = function(chain){
        console.log("changing type of chain "+chain.title);
        var oldType = chain.type;
        chainService.changeType(chain._id).then(function(res){
            var newType = res.type;
            $scope.alerts.push({title:'Chain #'+chain.title+" has been successfully moved from "+oldType+" to "+newType+" !"});
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

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.open = function (chain) {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ChainInstanceCtrl',
      chain: chain,
      resolve: {
        chain: function () {
          return chain;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

}]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

appControllers.controller('ChainInstanceCtrl', ['$scope','$uibModalInstance','chainService','chain',function ChainInstanceCtrl($scope, $uibModalInstance,chainService, chain) {

  //$scope.items = items;
  // $scope.selected = {
  //   item: $scope.items[0]
  // };

  $scope.chain = chain;
  $scope.pictures = [];
  $scope.displayPic = false;
  $scope.pictures.push(chain.author);
  for (var i = 0 ; i < chain.chainers.length ; i++){
    $scope.pictures.push(chain.chainers[i]);
  }

  $scope.ok = function () {
    $uibModalInstance.close(chain);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.alerts = [];


  $scope.init = function(){
    chainService.getChain(chain._id).then(function(res){
        $scope.chain = res;
    })
  }

   $scope.deletePicture = function(picture){
        console.log("deleting picture "+picture._id);
        if (confirm("Etes-vous sûr de vouloir supprimer la photo de "+picture.username+" ?")){
            chainService.deletePicture(picture._id).then(function(res){
                // $scope.alerts.push({title:'Chain #'+chain.title+" has been successfully deleted !"});
                // $timeout(function(){ $scope.alerts.splice(0,1);console.log("timeout"); }, 3000);
                $scope.init();
            })
        }
    }




}]);