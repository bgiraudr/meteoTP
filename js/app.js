/**
 * GIRAUD-RENARD Benjamin
 * JEZO Henri
 */

//router between pages using angular js
var app = angular.module("MeteoTP", ["ngRoute", "mainCtrl"]);
app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    //define the html file to show and the controller to use
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
  //default page
  .otherwise({redirectTo: "/"});
});