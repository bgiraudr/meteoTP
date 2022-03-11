var villes = []

var icon_meteo = {
  "Thunderstorm":"wi-day-lightning", "Drizzle":"wi-day-sleet", "Rain":"wi-day-rain", "Snow":"wi-day-snow", "Clouds":"wi-cloud", "Clear":"wi-day-clear"
}

var api_key = "ee07e2bf337034f905cde0bdedae3db8";

var app = angular.module("mainCtrl", []);
app.controller("homeCtrl", function ($scope, $http) {
  villes = JSON.parse(localStorage.villes);

  for(let i of villes) {
    let req = {
      method: 'GET',
      url: "http://api.openweathermap.org/data/2.5/weather?q=" + i.name + "&units=metric&lang=fr&APPID=" + api_key,
    };

    $http(req).then(function(response) {
      i.temps = response.data.weather[0].description;
      i.temp = response.data.main.temp;
      i.humid =  response.data.main.humidity;
      i.vent = response.data.wind.speed;
      i.orient = response.data.wind.deg;

      let icon = icon_meteo[response.data.weather[0].main];
      i.icon = response.data.weather[0].icon.includes('n') ? icon.replace("day", "night") : icon;

      //only for "more" button
      i.min = response.data.main.temp_min;
      i.max = response.data.main.temp_max;
      i.feel = response.data.main.feels_like;
      i.pressure = response.data.main.pressure;
    })
  }

  $scope.villes = villes;

  $scope.delete = function(id) {
    villes.splice(id,1);
    localStorage.villes = JSON.stringify(villes);
  }
});

app.controller("prevision", function ($scope, $http, $route, $window) {
  if($route.current.params.id == undefined) {
    $window.location.href = "#";
  } else {
    let villeid = JSON.parse(localStorage.villes)[$route.current.params.id-1];

    let req = {
      method: 'GET',
      url: "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + villeid.name + "&APPID=" + api_key + "&units=metric&lang=fr&cnt=8",
    };

    let previsions = []
    $http(req).then(function(response) {
      for(let day of response.data.list) {
        let icon = icon_meteo[day.weather[0].main];
        icon = day.weather[0].icon.includes('n') ? icon.replace("day", "night") : icon;

        let date = new Intl.DateTimeFormat("fr-FR", {weekday: "long", month:"long", day:"numeric"}).format(new Date(day["dt"]*1000));
        info_day = {"date":date, "icon":icon, "tempmax":day.temp.max, "tempmin":day.temp.min};
        previsions.push(info_day);
      }
      $scope.previsions = previsions;
      $scope.ville = villeid.name;
    });
  }
});

app.controller("villes", function ($scope, $http) {
  villes = JSON.parse(localStorage.villes);
  
  $scope.previsions = villes;
  $scope.add = function() {
    let req = {
        method: 'GET',
        url: "http://api.openweathermap.org/geo/1.0/direct?limit=1&q=" + $scope.nomville + "&appid=" + api_key,
    }

    $http(req).then(function(response) {
      if(response.data.length > 0) {
        if(response.data[0].name.toUpperCase() == $scope.nomville.toUpperCase()) {
          villes.push({"name" : $scope.nomville, "id" : villes.length+1});
          localStorage.villes = JSON.stringify(villes);
          M.toast({html: $scope.nomville + " ajouté !", classes: 'green rounded'});
        } else {
          M.toast({html: $scope.nomville + " non trouvée...", classes: 'red rounded'});
        }
      } else {
        M.toast({html: $scope.nomville + " non trouvée...", classes: 'red rounded'});
      }
    })
  };
});