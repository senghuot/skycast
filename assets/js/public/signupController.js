var app = angular.module('signupModule', ['compareTo', 'toastr']);

app.controller('signupController', ['$scope', '$http', 'toastr', function($scope, $http, toastr) {

  $scope.submitSignupForm = function() {
    $scope.signupForm.loading = true;

    $http.post('/signup', {
      name: $scope.signupForm.name,
      title: $scope.signupForm.title,
      email: $scope.signupForm.email,
      password: $scope.signupForm.password

    }).then(function onSuccess(res) {
      window.location = '/';

    }).catch(function onError(err) {
      if (err.status === 409) {
        toastr.error('Email address has already been registered.');
      }

    }).finally(function mustExec() {
      $scope.signupForm.loading = false;
    });
  };

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





