appControllers.controller('subscribersCtrl', ['$scope','$http','subscriberService',function UsersCtrl($scope,$http,subscriberService) {





//Creation du  tableau des utilisateurs
    subscriberService.fetch().then(function(res) {

        $scope.subscribers = res;
    })

}]);