var app = angular.module('indexModule', ['compareTo', 'toastr']);

app.controller('indexController', ['$scope', '$http', 'toastr', function($scope, $http, toastr) {

  // set-up loginForm loading state
  $scope.loginForm = {
    loading: false
  };

  $scope.submitLoginForm = function() {

    // submit request to Sails.
    $http.post('/login', {
      email: $scope.loginForm.email,
      password: $scope.loginForm.password
    })
    .then(function onSuccess () {
      // Refresh the page now that we've been logged in.
      toastr.success('Sucessfully logged in.');
      setTimeout(function() {
        window.location = '/dashboard';
      }, "1000");
    })
    .catch(function onError(sailsResponse) {

      // Handle known error type(s).
      // Invalid username / password combination.
      if (sailsResponse.status === 400 || 404) {
        toastr.error('Invalid email/password combination.', 'Error', {closeButton: true});
      } else {
        toastr.error('An unexpected error occurred, please try again.', 'Error', {closeButton: true})
      }
    })
    .finally(function eitherWay(){
      $scope.loginForm.loading = false;
    });
  }

}]);
