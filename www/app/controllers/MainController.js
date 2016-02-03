angular.module('MainController', [])

  .controller('HomeController', function($scope) {
    console.log('home page');
  })
  .controller('RegisterController', function($scope, Auth, $window, $location) {
    // stores register form parameters when user clicks 'register'
    $scope.register = {
      email: '',
      password: ''
    };

    $scope.registerUser = function() {
      // use Auth service to send form parameters as a POST request to register route
      Auth.register($scope.register).then(function(res) {
        // if register route responds with a token, save it in sessionStorage and redirect to account page
        if (res.data.token) {
          $window.sessionStorage.token = res.data.token;
          $location.url('/account');
        }
      }, function(err) {
        console.log('Error');
      });
    }

  })
  .controller('LoginController', function($scope, Auth, $window, $location) {

    $scope.loginUser = function() {

      // concatenate the login form parameters and store string
      $scope.authString = $scope.login.email + ':' + $scope.login.password;

      // use Auth service to send base64 encoded authString as a GET request to login route
      Auth.login(btoa($scope.authString)).then(function(res) {
        // if login route responds with a token, store it in sessionStorage and redirect to account page
        if (res.data.token) {
          $window.sessionStorage.token = res.data.token;
          $location.url('/account');
        }
      });
    }

  })
  .controller('AccountController', function($scope, Post, $rootScope) {

    $scope.allPosts = []; // stores all the post objects created by the authenticated user
    $scope.updatePost = {}; // stores the post properties of the post being updated
    $scope.selectedIndex = null;

    $scope.showPost = function(index){
      $scope.post = $scope.allPosts[index]; // stores the selected post
      $scope.selectedIndex = index; // stores the index of the selected post
    };

    $scope.newPostControls = {
      interfaceIsOpen: false,
      newPost: {},
      togglePostInterface: function() {
        this.interfaceIsOpen = !this.interfaceIsOpen;
      },
      sendPost: function() {
        Post.createPost(this.newPost).then((data) => {
            // Clear Form
            this.clearPost();
            // Broadcast POST UPDATED
            $rootScope.$broadcast('POSTUPDATED');
            this.togglePostInterface();
            console.log(data);
        }, function(err) {
          console.log('Error');
          console.log(err);
        })
      },
      clearPost: function() {
        this.newPost = {};
      }
    };

    $scope.editPost = function() {
      Post.updatePost($scope.updatePost).then(function(data) {
        console.log(data);
      });
    };

    $scope.getAllPosts = function() {
      Post.getPost().then(function(res) {
        $scope.allPosts = res.data.posts;
        console.log('POSTS UPDATED');
      });
    }

    // Get all Posts when page first loads
    $scope.getAllPosts();

    $scope.$on('POSTUPDATED', function(){
      $scope.getAllPosts();
    })

  })

  // DIRECTIVES
  .directive("contenteditable", function() {
    return {
      restrict: "A",
      require: "ngModel",
      link: function(scope, element, attrs, ngModel) {

        function read() {
          ngModel.$setViewValue(element.html());
        }

        ngModel.$render = function() {
          element.html(ngModel.$viewValue || "");
        };

        element.bind("blur keyup change", function() {
          scope.$apply(read);
        });
      }
    };
  });
