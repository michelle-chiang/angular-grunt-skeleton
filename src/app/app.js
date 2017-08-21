angular.module("main", [
  // URLs
  "main.routes",

  // third-party libraries
  "ui.router",
  "LocalStorageModule",

  // main application logic
  "main.home",

  //services 

  // templates
  "templates-app",
  "templates-common"
])

.config(function (localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix("cyclesEditor");
})

.run(function ($rootScope, $state, $window) {
  $state.go("login");
});
