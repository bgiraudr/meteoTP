var app = angular.module("MeteoTP", ["ngRoute"]);
app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "../partials/meteoville.html"
  })
  .when("/previsions", {
    templateUrl : "../partials/previsions.html"
  })
  .when("/villes", {
    templateUrl : "../partials/villes.html"
  });
});