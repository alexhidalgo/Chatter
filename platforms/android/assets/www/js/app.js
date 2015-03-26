angular.module('app', ['ionic', 'firebase', 'app.controllers', 'angularMoment'])

.run(function($ionicPlatform, amMoment) {
  amMoment.changeLocale('de');
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('chat', {
    url: '/chat',
    templateUrl: 'templates/chat.html',
    controller: 'ChatCtrl'
  });

  $urlRouterProvider.otherwise('/login');
})

.directive('bottomScroll', function() {
  return {
    scope: {
      bottomScroll: "="
    },
    link: function($scope, element) {
      scope.$watchCollection('bottomScroll', function(newValue) {
        if(newValue) {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });
    }
  };
});

// .directive('bottomScroll', function() {
//   return {
//       restrict: 'AE',
//       replace: 'true',
//       template: '<h3>Hello World!!</h3>'
//   };
// });
