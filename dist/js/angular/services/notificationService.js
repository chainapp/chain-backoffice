appServices.service('notificationService', function ($rootScope,$http,$q) {

this.fetchNotifications = function() {
  var deferred = $q.defer();
  $http({
    method: 'GET',
    url: 'http://chain-backoffice.elasticbeanstalk.com/notifications',
    //url: 'http://localhost:8081/notifications',
    headers: {'Content-type':'application/json'}
  }).
  success(function (data, status, headers, config) {
    deferred.resolve(data);
  }).
  error(function (data, status) {
    deferred.reject(data);
  });

  return deferred.promise;

}


    this.addNotification = function(message,type,lang) {
        var deferred = $q.defer();
        console.log("adding notif "+message,type,lang);
        $http({
            method: 'POST',
            url: 'http://chain-backoffice.elasticbeanstalk.com/notifications',
            //url: 'http://localhost:8081/notifications',
            headers: {'Content-type':'application/json'},
            data: {message:message,type:type,lang:lang}
        }).
            success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).
            error(function (data, status) {
                deferred.reject(data);
            });

        return deferred.promise;

    }

    this.updateNotification = function(id,message,type,lang) {
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: 'http://chain-backoffice.elasticbeanstalk.com/notifications/'+id,
            //url: 'http://localhost:8081/notifications/'+id,
            headers: {'Content-type':'application/json'},
            data: {message:message,type:type,lang:lang}
        }).
            success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).
            error(function (data, status) {
                deferred.reject(data);
            });

        return deferred.promise;

    }

});
