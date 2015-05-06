appControllers.controller('usersCtrl', ['$scope','$http','userService',function UsersCtrl($scope,$http,userService) {





//Creation du  tableau des utilisateurs
    userService.fetch().then(function(res) {

        $scope.users = res;
    })

}]);