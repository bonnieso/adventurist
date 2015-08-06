angular.module('adventureApp')
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/')
    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: '../views/index.html',
        controller: 'indexCtrl'
      })
      .state('board', {
        url: '/board',
        templateUrl: '../views/board.html',
        controller: 'boardCtrl'
      })
      .state('user', {
        url: '/user',
        templateUrl: '../views/user.html',
        controller: 'userCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: '../views/profile.html',
        controller: 'profileCtrl'
      })
      .state('myboard', {
        url: '/myboard',
        templateUrl: '../views/myboard.html',
        controller: 'myboardCtrl'
      })
  });