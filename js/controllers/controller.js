var villes = [
  {"name" : "Vannes", "id" : 1},
  {"name" : "Paris", "id" : 2},
  {"name" : "Las Vegas", "id" : 3}
]

var icon_meteo = {
  "Thunderstorm":"wi-day-lightning",
  "Drizzle":"wi-day-sleet",
  "Rain":"wi-day-rain",
  "Snow":"wi-day-snow",
  "Clouds":"wi-cloud",
  "Clear":"wi-day-clear"
}

var api_key = "ee07e2bf337034f905cde0bdedae3db8";

var app = angular.module("mainCtrl", []);
app.controller("homeCtrl", function ($scope, $http) {

  for(let i of villes) {
    let api = "http://api.openweathermap.org/data/2.5/weather?q=" + i.name;
    api += "&units=metric";
    api += "&lang=fr";
    api += "&APPID=" + api_key;

    var req = {
      method: 'GET',
      url: api,
    };

    $http(req).then(function(response) {
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



app.controller("prevision", function ($scope, $http, $route) {
  let id = $route.current.params.id;
  let villeid;
  for(let i of villes) {
    if(i.id == id) {
      villeid = i;
      break;
    }
  }

  $scope.ville = villeid.name;

  //get the lat ; long of the city
  let api = "http://api.openweathermap.org/data/2.5/weather?q=" + villeid.name;
  api += "&APPID=" + api_key;

  let lat, lon;

  let req = {
    method: 'GET',
    url: api,
  };

  let previsions = []

  $http(req).then(function(response) {
    lon = response.data.coord.lon;
    lat = response.data.coord.lat;

    //get the daily prevision
    
    api = "https://api.openweathermap.org/data/2.5/onecall?";
    api += "lat=" + lat;
    api += "&lon=" + lon;
    api += "&units=metric";
    api += "&exclude=current,minutely,hourly,alerts"
    api += "&APPID=" + api_key;

    req = {
      method: 'GET',
      url: api,
    }

    $http(req).then(function(response) {
      for(let i = 1; i < response.data.daily.length; i++) {
        let day = response.data.daily[i];
        let icon = icon_meteo[day["weather"][0]["main"]];
        if(day["weather"][0]["icon"].includes('n')) {
          icon = icon.replace("day", "night");
        }

        let date = new Date(day["dt"]*1000).toLocaleDateString("fr-FR");
        dict = {
          "date":date,
          "icon":icon,
          "tempmax":day["temp"]["max"],
          "tempmin":day["temp"]["min"],
        };
        previsions.push(dict);
      }

      $scope.previsions = previsions;
    });
  });

  
});

app.controller("villes", function ($scope, $http) {
  console.log("villes")
});