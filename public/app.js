angular.module('App',
[
  'App.navbar',
  'App.sidebar',
  'App.footer',
  'App.gifService',
  'App.eventList',
  'App.ideaCtrl',
  'App.ideaService',
  'App.ideaBtn',
  'App.listCtrl',
  // 'App.signUpCtrl',
  'App.sidebarCtrl',
  'ngAnimate',
  'ui.router'
])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/getidea');
  $stateProvider
  .state('home', {
    url: '/getidea',
    templateUrl: 'views/main.html',
    controller: 'IdeaController'
  })
  // routing for old view swap - not to be used with new look
    .state('home.list', {
      url: '/{searchTerm}',
      templateUrl: 'views/list.html',
      controller: 'ListController'
    })
});
