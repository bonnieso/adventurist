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
      .state('guide', {
        url: '/guide/:guideid',
        templateUrl: '../views/guide.html',
        controller: 'guideCtrl'
      })
      .state('browse', {
        url: '/browse',
        templateUrl: '../views/browse.html',
        controller: 'browseCtrl'
      })
      .state('favorites', {
        url: '/favorites',
        templateUrl: '../views/favorites.html',
        controller: 'favoritesCtrl'
      })
  });
