appControllers.controller('settingsCtrl', ['$scope','$http','chainService','notificationService','$filter','$timeout',function SettingsCtrl($scope,$http,chainService,notificationService,$filter,$timeout) {

$scope.alerts = [];
$scope.tags = [];
$scope.notifs = [];
$scope.types = [];
$scope.isDisabled = true;
$scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };

$scope.initForbiddens = function(){
    chainService.getForbiddens().then(function(res){

        console.log("getForbiddens chains result is :");
        console.log(res);
        $scope.tags = res;
    })
}
$scope.initNotifications = function(){
    notificationService.fetchNotifications().then(function(notifs){

        console.log("notifications chains result is :");
        console.log(notifs);
        $scope.notifs = notifs;
        for (var i = 0; i < notifs.length;i++){
            if ($scope.types.indexOf(notifs[i].type) == -1){
                $scope.types.push(notifs[i].type)
            }
        }
    })
}
$scope.initForbiddens();
$scope.initNotifications();

$scope.add = function(){
        console.log("adding tag "+$scope.tag);
        
        chainService.addForbidden($scope.tag).then(function(res){
            $scope.alerts.push({title:'#'+$scope.tag});
            $timeout(function(){ $scope.alerts.splice(0,1);console.log("timeout"); }, 2000);
            $scope.initForbiddens();
        })
    }
	
$scope.addNotif = function(){
        console.log("adding notif "+$scope.message,$scope.type,$scope.lang);
        
        notificationService.addNotification($scope.message,$scope.type,$scope.lang).then(function(res){
            $scope.alerts.push({title:'Notification '+$scope.message});
            $timeout(function(){ $scope.alerts.splice(0,1);console.log("timeout"); }, 2000);
            $scope.initNotifications();
            $scope.message = '';
            $scope.type = '';
            $scope.lang = '';
        })
    }
$scope.edit = function(notif){
        console.log("edit notif ");
        $scope.isDisabled = false;
        $scope.message = notif.message;
        $scope.type = notif.type;
        $scope.lang = notif.lang;
        $scope.id = notif._id;
    }
$scope.editNotif = function(){
        console.log("editing notif ");
        
        notificationService.updateNotification($scope.id,$scope.message,$scope.type,$scope.lang).then(function(res){
            $scope.alerts.push({title:'Notification '+$scope.message});
            $timeout(function(){ $scope.alerts.splice(0,1);console.log("timeout"); }, 2000);
            $scope.initNotifications();
            $scope.message = '';
            $scope.type = '';
            $scope.lang = '';
        })
    }

}]);
