appServices.service('tagService', function ($rootScope,$http,$q) {

    this.fetch = function() {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: 'http://chain-backoffice.elasticbeanstalk.com/v2/tags',
            //url: 'http://localhost:8081/v2/tags',
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

    this.create = function(tag) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: 'http://chain-backoffice.elasticbeanstalk.com/v2/tags/',
            //url: 'http://localhost:8081/v2/tags',
            headers: {
                'Content-type':'application/json'
            },
            data: tag 
        }).
            success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).
            error(function (data, status) {
                deferred.reject(data);
            });

        return deferred.promise;

    }

    this.update = function(tag) {
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: 'http://chain-backoffice.elasticbeanstalk.com/v2/tags/'+tag._id,,
            //url: 'http://localhost:8081/v2/tags/'+tag._id,
            headers: {
                'Content-type':'application/json'
            },
            data: tag 
        }).
            success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).
            error(function (data, status) {
                deferred.reject(data);
            });

        return deferred.promise;

    }

    this.delete = function(tagId) {
        var deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: 'http://chain-backoffice.elasticbeanstalk.com/v2/tags/'+tagId,
            //url: 'http://localhost:8081/v2/tags/'+tagId,
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
