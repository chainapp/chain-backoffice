appServices.service('eventService', function ($rootScope,$http,$q) {

this.fetch = function() {
  var deferred = $q.defer();
  $http({
    method: 'GET',
    //url: 'http://localhost:8081/events',
    url: 'http://chain-backoffice-qlf.elasticbeanstalk.com/events',
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
