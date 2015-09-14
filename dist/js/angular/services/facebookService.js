appServices.service('facebookService', function ($rootScope,$http,$q) {

this.likesCount = function() {
  var deferred = $q.defer();
  $http({
    method: 'GET',
    url: 'https://chain-backoffice-qlf.elasticbeanstalk.com/facebook/likes/count',
    //url: 'http://localhost:8081/facebook/likes/count',
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
