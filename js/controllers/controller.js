var villes = ["Vannes", "Paris"];

var app = angular.module("mainCtrl", []);
app.controller("homeCtrl", function ($scope, $http) {

  let city = villes[0];

  let api = "http://api.openweathermap.org/data/2.5/weather?q=" + city;
  api += "&units=metric";
  api += "&lang=fr";
  api += "&APPID=ee07e2bf337034f905cde0bdedae3db8";

  var req = {
    method: 'GET',
    url: api,
  }

  $http(req).then(function(response) {
    console.log(response.data);
    $scope.nomVille = response.data["name"];
    $scope.temps = response.data["weather"][0]["description"];
    $scope.temp = response.data["main"]["temp"];
    $scope.humid = response.data["main"]["humidity"];
    $scope.vent = response.data["wind"]["speed"];
    $scope.orient = response.data["wind"]["deg"];
  })
});

app.controller("prevision", function ($scope, $http) {
  console.log("prévisions")
});

app.controller("villes", function ($scope, $http) {
  console.log("villes")
});