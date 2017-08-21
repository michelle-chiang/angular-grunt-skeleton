angular.module("main.routes", ["ui.router"])

.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
      $urlRouterProvider.otherwise("/");

      $stateProvider
        .state("home", {
          url: "/home",
          controller: "homeCtrl",
          templateUrl: "home/home.tpl.html"
        });
    }
  ]
);
