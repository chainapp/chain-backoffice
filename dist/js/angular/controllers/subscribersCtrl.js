appControllers.controller('subscribersCtrl', ['$scope','$http','subscriberService','$modal','$log',function UsersCtrl($scope,$http,subscriberService,$modal,$log) {

	$scope.items = ['item1', 'item2', 'item3'];

  	$scope.animationsEnabled = true;

	$scope.open = function (name,mail) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        items: function () {
          return $scope.items;
        },
        name: function () {
        	return name;
        },
        mail: function () {
        	return mail;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };





//Creation du  tableau des utilisateurs
    subscriberService.fetch().then(function(res) {

        $scope.subscribers = res;
    })

}]);

appControllers.controller('ModalInstanceCtrl', ['$scope','subscriberService','$modalInstance','items','name','mail',function ($scope, subscriberService, $modalInstance, items, name, mail) {

  $scope.items = items;
  $scope.title = "Contacter "+name+" ("+mail+")";
  // $scope.selected = {
  //   item: $scope.items[0]
  // };

  $scope.ok = function () {
  	subscriberService.notify(name,mail,$scope.mailTitle,$scope.mailContent).then(function(data){
  		$modalInstance.close();
  	});
    
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);