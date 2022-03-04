var villes = [
  {"name" : "Vannes", "id" : 1},
  {"name" : "Paris", "id" : 2}
]

var icon_meteo = {
  "Thunderstorm":"wi-day-lightning",
  "Drizzle":"wi-day-sleet",
  "Rain":"wi-day-rain",
  "Snow":"wi-day-snow",
  "Clouds":"wi-cloud",
  "Clear":"wi-day-clear"
}

var app = angular.module("mainCtrl", []);
app.controller("homeCtrl", function ($scope, $http) {

  for(let i of villes) {
    let api = "http://api.openweathermap.org/data/2.5/weather?q=" + i.name;
    api += "&units=metric";
    api += "&lang=fr";
    api += "&APPID=ee07e2bf337034f905cde0bdedae3db8";

    var req = {
      method: 'GET',
      url: api,
    }

    $http(req).then(function(response) {
      console.log(response.data);
      i["temps"] = response.data["weather"][0]["description"];
      i["temp"] = response.data["main"]["temp"];
      i["humid"] =  response.data["main"]["humidity"];
      i["vent"] = response.data["wind"]["speed"];
      i["orient"] = response.data["wind"]["deg"];

      let icon = icon_meteo[response.data["weather"][0]["main"]];
      if(response.data["weather"][0]["icon"].includes('n')) {
        icon = icon.replace("day", "night");
      }
      i["icon"] = icon;
    })
  }

  $scope.villes = villes;
});

app.controller("prevision", function ($scope, $http) {
  console.log("prévisions")
});

app.controller("villes", function ($scope, $http) {
  console.log("villes")
});