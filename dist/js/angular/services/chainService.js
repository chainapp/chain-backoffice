appServices.service('chainService', function ($rootScope,$http,$q) {

this.newChainsByDay = function() {
  var deferred = $q.defer();
  $http({
    method: 'GET',
    url: 'http://chain-backoffice.elasticbeanstalk.com/chains/newChainsByDay',
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

this.newChainsV2ByDay = function() {
  var deferred = $q.defer();
  $http({
    method: 'GET',
    url: 'http://chain-backoffice.elasticbeanstalk.com/chains/newChainsV2ByDay',
    //url: 'http://localhost:8081/chains/newChainsV2ByDay',
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
            url: 'http://chain-backoffice.elasticbeanstalk.com/v2/chains/0/100',
            //url: 'http://localhost:8081/v2/chains/0/100',
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

    this.getChain = function(chainId) {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: 'http://chain-backoffice.elasticbeanstalk.com/v2/chains/'+chainId,
            //url: 'http://localhost:8081/v2/chains/'+chainId,
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

    this.getForbiddens = function() {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: 'http://chain-backoffice.elasticbeanstalk.com/chains/forbiddens',
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

    this.addForbidden = function(tag) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: 'http://chain-backoffice.elasticbeanstalk.com/chains/forbiddens',
            //url: 'http://localhost:8081/chains',
            headers: {'Content-type':'application/json'},
            data: {tag:tag}
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
            url: 'http://chain-backoffice.elasticbeanstalk.com/chains/chainersByChain',
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
            url: 'http://chain-backoffice.elasticbeanstalk.com/chains/chainsByChainer',
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

    this.chainsByType = function() {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: 'http://chain-backoffice.elasticbeanstalk.com/chains/chainsByType',
            //url: 'http://localhost:8081/chains/chainsByType',
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

    this.topChainers = function() {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: 'http://chain-backoffice.elasticbeanstalk.com/chains/topChainers',
            //url: 'http://localhost:8081/chains/topChainers',
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
    url: 'http://chain-backoffice.elasticbeanstalk.com/users/count',
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
            url: 'http://chain-backoffice.elasticbeanstalk.com/v2/chains/'+chainId,
            //url: 'http://localhost:8081/v2/chains/'+chainId,
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


this.deletePicture = function(chainerId) {
        var deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: 'http://chain-qlf.elasticbeanstalk.com/v2/chainers/'+chainerId,
            //url: 'http://localhost:8081/v2/chainers/'+chainerId,
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

    this.changeType = function(chainId) {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: 'http://chain-backoffice.elasticbeanstalk.com/v2/chains/changeType/'+chainId,
            //url: 'http://localhost:8081/v2/chains/changeType/'+chainId,
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
