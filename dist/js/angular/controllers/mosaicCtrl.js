appControllers.controller('mosaicCtrl', ['$scope','$http','userService','chainService','ngTableParams',function mosaicCtrl($scope,$http,userService,chainService,ngTableParams) {

  $scope.clickPosition = {
    x : null,
    y : null
  }
  $scope.clickCount = 0;



  $scope.getClick = function(event){
    $scope.clickPosition.x = event.offsetX;
    $scope.clickPosition.y = event.offsetY;
    $scope.clickCount++;
    var container = document.getElementById('pictureContainer');

    container.scrollTo($scope.clickPosition.x, $scope.clickPosition.y);
  }

  chainService.fetch().then(function(res) {

        $scope.chains = res;
        
    })


}]);