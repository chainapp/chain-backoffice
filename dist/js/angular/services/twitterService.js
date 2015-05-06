appServices.service('twitterService', function ($rootScope,$http,$q) {

this.followersCount = function() {
  var deferred = $q.defer();
  $http({
    method: 'GET',
    url: 'http://localhost:8081/twitter/followers/count',
    //url: 'http://lb.qlf-waas.priv.atos.fr:8068/getArret',
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
