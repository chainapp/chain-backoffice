appServices.service('subscriberService', function ($rootScope,$http,$q) {

this.newSubscribersByDay = function() {
  var deferred = $q.defer();
  $http({
    method: 'GET',
    //url: 'http://localhost:8081/subscribers/newSubscribersByDay',
    url: 'http://52.17.127.121:8081/subscribers/newSubscribersByDay',
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
            //url: 'http://localhost:8081/subscribers',
             url: 'http://52.17.127.121:8081/subscribers',
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
    //url: 'http://localhost:8081/subscribers/count',
    url: 'http://52.17.127.121:8081/subscribers/count',
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

this.notify = function(user, mail, title, content) {
  var deferred = $q.defer();
  $http({
    method: 'POST',
    //url: 'http://localhost:8081/notify/news_mail/'+mail,
    url: 'http://52.17.127.121:8081/subscribers/count',
    //url: 'http://lb.qlf-waas.priv.atos.fr:8068/getArret',
    headers: {'Content-type':'application/json'},
    data: {user:user,title:title,content:content}
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
