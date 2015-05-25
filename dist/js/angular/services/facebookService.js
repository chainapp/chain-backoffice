appServices.service('facebookService', function ($rootScope,$http,$q) {

this.likesCount = function() {
  var deferred = $q.defer();
  $http({
    method: 'GET',
    url: 'https://graph.facebook.com/v2.2/1556073201276412?fields=name,likes&access_token=CAACEdEose0cBAOgZC7DEO6mMuZAvQAaWZCLIW5gOmYEdM5mL1sjZCwSlJj580ZAtfpa3b0Ru313A60pWhIH89lJ1cXJON7ZAiAyUSYyEFxMJqt19I17RhahtcAiVqF8HNfWC0sUYKXJdgWcVIgk5atBqXXFIu7GKGLLUJk8kDvXyDZCRV8a1GdBJCZBdFyqcyuqyBgWWgWaz3uRpJLdu6ZCQz43FDcmkSYSMZD',
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
