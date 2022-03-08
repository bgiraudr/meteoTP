var app = angular.module("MeteoTP", ["ngRoute", "mainCtrl"]);
app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "partials/meteovilles.html",
    controller : "homeCtrl"
  })
  .when("/previsions", {
    templateUrl : "partials/previsions.html",
    controller : "prevision"
  })
  .when("/villes", {
    templateUrl : "partials/villes.html",
    controller : "villes"
  })
  .otherwise({redirectTo: "/"});
});