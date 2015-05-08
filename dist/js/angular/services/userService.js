appServices.service('userService', function ($rootScope,$http,$q) {

this.newUsersByDay = function() {
  var deferred = $q.defer();
  $http({
    method: 'GET',
    url: 'http://52.17.127.121:8081/users/newUsersByDay',
    //url: 'http://localhost:8081/users/newUsersByDay',
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
            url: 'http://52.17.127.121:8081/users',
            //url: 'http://localhost:8081/users',
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
    url: 'http://52.17.127.121:8081/users/count',
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
});
