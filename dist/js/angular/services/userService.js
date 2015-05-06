appServices.service('userService', function ($rootScope,$http,$q) {

this.newUsersByDay = function() {
  var deferred = $q.defer();
  $http({
    method: 'GET',
    url: 'http://52.17.127.121:8081/users/newUsersByDay',
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

    this.fetch = function() {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: 'http://52.17.127.121:8081/users',
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


this.count = function() {
  var deferred = $q.defer();
  $http({
    method: 'GET',
    url: 'http://52.17.127.121:8081/users/count',
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
