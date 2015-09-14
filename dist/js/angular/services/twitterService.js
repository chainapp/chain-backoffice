appServices.service('twitterService', function ($rootScope,$http,$q) {

this.followersCount = function() {
  var deferred = $q.defer();
  $http({
    method: 'GET',
    //url: 'http://localhost:8081/twitter/followers/count',
    url: 'http://chain-backoffice-qlf.elasticbeanstalk.com/twitter/followers/count',
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
