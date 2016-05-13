var app = angular.module('dashboardModule', ['toastr']);

app.controller('dashboardController', ['$scope', '$http', 'toastr', function($scope, $http, toastr) {

  $scope.submitLogoutForm = function() {

    $http.get('/logout').then(function onSuccess() {
      toastr.info('Logging out.');
      setTimeout(function() {
        window.location = '/';
      }, "1000");

    }).catch(function onError(err) {
        toastr.error('Email address has already been registered.');
    });
  }

  $scope.search = function() {
    $http.post('/search', {keyword: $scope.keyword})
      .then(function onSuccess (res) {
        $scope.response = res.data;
        console.log(res);
      })
      .catch(function onError(res) {
        console.log(res);
      })
  };

}]);
