appServices.service('chainService', function ($rootScope,$http,$q) {

this.newChainsByDay = function() {
  var deferred = $q.defer();
  $http({
    method: 'GET',
    url: 'http://chain-backoffice-qlf.elasticbeanstalk.com/chains/newChainsByDay',
    //url: 'http://localhost:8081/chains/newChainsByDay',
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

    this.fetch = function() {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: 'http://chain-backoffice-qlf.elasticbeanstalk.com/chains',
            //url: 'http://localhost:8081/chains',
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

    this.chainersByChain = function() {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: 'http://chain-backoffice-qlf.elasticbeanstalk.com/chains/chainersByChain',
            //url: 'http://localhost:8081/chains/chainersByChain',
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

    this.chainsByChainer = function() {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: 'http://chain-backoffice-qlf.elasticbeanstalk.com/chains/chainsByChainer',
            //url: 'http://localhost:8081/chains/chainsByChainer',
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


this.count = function() {
  var deferred = $q.defer();
  $http({
    method: 'GET',
    url: 'http://chain-backoffice-qlf.elasticbeanstalk.com/users/count',
    //url: 'http://localhost:8081/users/count',
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

this.delete = function(chainId) {
        var deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: 'http://chain-qlf.elasticbeanstalk.com/chains/'+chainId,
            //url: 'http://localhost:8081/chains/chainersByChain',
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
