appServices.service('notificationService', function ($rootScope,$http,$q) {

    this.fetch = function() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: 'http://chain-backoffice.elasticbeanstalk.com/notifications',
        //url: 'http://localhost:8081/v2/notifications',
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


    this.create = function(message,type,lang,status,threshold) {
        var deferred = $q.defer();
        console.log("adding notif "+message,type,lang,status,threshold);
        $http({
            method: 'POST',
            url: 'http://chain-backoffice.elasticbeanstalk.com/notifications',
            //url: 'http://localhost:8081/v2/notifications',
            headers: {'Content-type':'application/json'},
            data: {message:message,type:type,lang:lang,status:status,threshold:threshold}
        }).
            success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).
            error(function (data, status) {
                deferred.reject(data);
            });

        return deferred.promise;

    }

    this.update = function(id,message,type,lang,status,threshold) {
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: 'http://chain-backoffice.elasticbeanstalk.com/notifications/'+id,
            //url: 'http://localhost:8081/v2/notifications/'+id,
            headers: {'Content-type':'application/json'},
            data: {message:message,type:type,lang:lang,status:status,threshold:threshold}
        }).
            success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).
            error(function (data, status) {
                deferred.reject(data);
            });

        return deferred.promise;

    }

    this.delete = function(id) {
        var deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: 'http://chain-backoffice.elasticbeanstalk.com/notifications/'+id,
            //url: 'http://localhost:8081/v2/notifications/'+id,
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

});
