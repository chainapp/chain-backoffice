appControllers.controller('settingsCtrl', ['$scope','$http','chainService','notificationService','tagService','$filter','$timeout','$uibModal','Upload',function SettingsCtrl($scope,$http,chainService,notificationService,tagService,$filter,$timeout,$uibModal,Upload) {

$scope.alerts = [];
$scope.tags = [];
$scope.reorderedTags = [];
$scope.forbiddens = [];
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
        $scope.forbiddens = res;
    })
}
$scope.initNotifications = function(){
    notificationService.fetch().then(function(notifs){

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
$scope.initTags = function(){
    tagService.fetch().then(function(tags){

        console.log("tags  result is :");
        $scope.tags = tags;
    })
}
$scope.initForbiddens();
$scope.initNotifications();
$scope.initTags();

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
        
        notificationService.create($scope.message,$scope.type,$scope.lang).then(function(res){
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

$scope.move = function(item,from,to,indexFrom,indexTo){
  console.log(item);
  console.log(from);
  console.log(to);
  console.log(indexFrom);
  console.log(indexTo);
  $scope.reorderedTags = [];
  for (var i = 0 ; i < to.length ; i++){
    var tag = to[i];
    tag.priority = i;
    $scope.reorderedTags.push(to[i]);
  }
}

$scope.reorder = function(){
  for (var i = 0 ; i < $scope.reorderedTags.length ; i++){
    //tagService.update($scope.reorderedTags[i]);
    console.log($scope.reorderedTags[i]);
    tagService.update($scope.reorderedTags[i]);
  }
}


$scope.animationsEnabled = true;

  $scope.openTag = function (tag) {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'tagModal.html',
      controller: 'TagInstanceCtrl',
      tag: tag,
      resolve: {
        tag: function () {
          return tag;
        },
        controllerScope : function(){
          return $scope;
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

appControllers.controller('TagInstanceCtrl', ['$scope','$uibModalInstance','tag','Upload','tagService',function TagInstanceCtrl($scope, $uibModalInstance, tag,controllerScope,Upload,tagService) {

  //$scope.items = items;
  // $scope.selected = {
  //   item: $scope.items[0]
  // };

  $scope.tag = tag;
  $scope.tagLabel = "";
  $scope.priority = 0;
  $scope.url = "";

  $scope.ok = function () {
    $uibModalInstance.close(tag);
    var tag = {};
    tag.tag = $scope.tagLabel;
    tag.url = $scope.url;
    tag.priority = $scope.priority;

    tagService.create(tag).then(function(tags){
      controllerScope.tags = tags;
    })
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.alerts = [];



    
    




}]);
