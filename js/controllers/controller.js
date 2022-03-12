/**
 * GIRAUD-RENARD Benjamin
 * JEZO Henri
 */

//the array that will contain cities
var villes = []

//a dictionnary to link openweathermap icon to a wi* icon
var icon_meteo = {
  "Thunderstorm":"wi-day-lightning", "Drizzle":"wi-day-sleet", "Rain":"wi-day-rain", "Snow":"wi-day-snow", "Clouds":"wi-cloud", "Clear":"wi-day-clear"
}

//the api key for openweathermap
var api_key = "ee07e2bf337034f905cde0bdedae3db8";

var app = angular.module("mainCtrl", []);

/**
 * Home controller
 * @param  $scope : the scope to dynamically change the html 
 * @param  $http : allow to use http to do some requests
 */
app.controller("homeCtrl", function ($scope, $http) {
  //get all of cities on the localStorage
  villes = JSON.parse(localStorage.villes);

  //if there is no city, display a text
  if(villes.length == 0) $scope.titre = "Aucune ville renseignée";

  //for each cities, get their information using a request to openweathermap
  for(let i of villes) {
    let req = {
      method: 'GET',
      url: "http://api.openweathermap.org/data/2.5/weather?q=" + i.name + "&units=metric&lang=fr&APPID=" + api_key,
    };

    $http(req).then(function(response) {
      //add field to the current city
      i.temps = response.data.weather[0].description;
      i.temp = response.data.main.temp;
      i.humid =  response.data.main.humidity;
      i.vent = response.data.wind.speed;
      i.orient = response.data.wind.deg;

      //determine the icon depends of the time
      let icon = icon_meteo[response.data.weather[0].main];
      i.icon = response.data.weather[0].icon.includes('n') ? icon.replace("day", "night") : icon;

      //only for "more" button
      i.min = response.data.main.temp_min;
      i.max = response.data.main.temp_max;
      i.feel = response.data.main.feels_like;
      i.pressure = response.data.main.pressure;
    })
  }

  //set the scope to display the cards
  $scope.villes = villes;

  //delete a city using it's id
  $scope.delete = function(id) {
    villes.splice(id,1);
    localStorage.villes = JSON.stringify(villes);
  }
});

/**
 * The "prevision" controller
 * @param  $scope
 * @param  $http
 * @param  $route : get the url's params
 * @param  $window : allow redirection
 */
app.controller("prevision", function ($scope, $http, $route, $window) {
  //if the user is on prevision but without an id -> redirect
  if($route.current.params.id == undefined) {
    $window.location.href = "#";
  } else {
    //get the clicked city depends of id param
    let villeid = JSON.parse(localStorage.villes)[$route.current.params.id];

    let req = {
      method: 'GET',
      url: "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + villeid.name + "&APPID=" + api_key + "&units=metric&lang=fr&cnt=8",
    };

    let previsions = []
    //for each day, add some information to the day
    $http(req).then(function(response) {
      for(let day of response.data.list) {
        let icon = icon_meteo[day.weather[0].main];
        icon = day.weather[0].icon.includes('n') ? icon.replace("day", "night") : icon;

        //format the date from UNIX format
        let date = new Intl.DateTimeFormat("fr-FR", {weekday: "long", month:"long", day:"numeric"}).format(new Date(day["dt"]*1000));
        //add to the array the info
        info_day = {"date":date, "icon":icon, "tempmax":day.temp.max, "tempmin":day.temp.min};
        previsions.push(info_day);
      }
      //set the scope
      $scope.previsions = previsions;
      $scope.ville = villeid.name;
    });
  }
});

/**
 * The add city controller
 * @param   $scope 
 * @param   $http
 */
app.controller("villes", function ($scope, $http) {
  //get the stored cities
  villes = JSON.parse(localStorage.villes);
  $scope.curr_villes = villes;

  //add a city function
  $scope.add = function() {
    let req = {
        method: 'GET',
        url: "http://api.openweathermap.org/geo/1.0/direct?limit=1&q=" + $scope.nomville + "&appid=" + api_key,
    }

    //check if the city exists on the database
    $http(req).then(function(response) {
      if(response.data.length > 0) {
        if(response.data[0].name.toUpperCase() == $scope.nomville.toUpperCase()) {
          //add to the array and the localstorage the city
          villes.push({"name" : $scope.nomville, "id" : villes.length+1});
          localStorage.villes = JSON.stringify(villes);
          M.toast({html: $scope.nomville + " ajouté !", classes: 'green rounded'});
        } else {
          //the city is not found, display an error
          M.toast({html: $scope.nomville + " non trouvée...", classes: 'red rounded'});
        }
      } else {
        M.toast({html: $scope.nomville + " non trouvée...", classes: 'red rounded'});
      }
    }, function(response) {
      //if the request failed, the input field must be empty.
      M.toast({html: "Le champ est vide", classes: 'red rounded'});
    })
  };

  //delete a city function
  $scope.delete = function(id) {
    villes.splice(id,1);
    localStorage.villes = JSON.stringify(villes);
  }
});