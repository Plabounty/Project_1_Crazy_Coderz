var city=""; 
var url="";
var key="";
var queryUrl ="";
var currentUrl = "";
var citiesDiv = document.getElementById("recentSearches");
var cities = []; 

function init(){
    var savedCities = JSON.parse(localStorage.getItem("cities"));
    if (savedCities !== null){
        cities = savedCities
    }   
    renderButtons(); 
}
init();

function clickList(){
    $(".listbtn").on("click", function(event){
        event.preventDefault();
        city = $(this).text().trim();
        APIcalls(); 
    })
}
clickList();

function searchClicker() {
    $("#searchbtn").on("click", function(event){
        event.preventDefault();
        city = $(this).prev().val().trim()
        cities.push(city);
        if(cities.length > 8){
            cities.shift()
        }
        if (city == ""){
            return; 
        }
        APIcalls();
        cityStorage(); 
        renderButtons();
    })
}
searchClicker();
 
function cityStorage(){
    localStorage.setItem("cities", JSON.stringify(cities)); 
}

function renderButtons(){
    citiesDiv.innerHTML = ""; 
    if(cities == null){
        return;
    }
    var newCity = [...new Set(cities)];
    for(var i=0; i < newCity.length; i++){
        var cityName = newCity[i]; 
        var buttonEl = document.createElement("button");
        buttonEl.textContent = cityName; 
        buttonEl.setAttribute("class", "listbtn"); 
        citiesDiv.appendChild(buttonEl);
        clickList();
      }
    }

function APIcalls(){
    url = "https://api.openweathermap.org/data/2.5/forecast?q=";    
    currentUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
    key = "&appid=cd12c82f6f4c333cf972f80da362c556";
    queryUrl = url + city + key;
    currentWeatherUrl = currentUrl + city + key; 
    
    $("#cityName").text("Today's Weather in " + city);
    $.ajax({
    url: queryUrl,
    method: "GET",
    }).then(function(response){
        var dayNum = 0;
        for(var i = 0; i < response.list.length; i++) {
            if(response.list[i].dt_txt.split(" ")[1] == "15:00:00") {
                var day = response.list[i].dt_txt.split("-")[2].split(" ")[0];
                var month = response.list[i].dt_txt.split("-")[1];
                var year = response.list[i].dt_txt.split("-")[0];
                var temp = Math.round(((response.list[i].main.temp - 273.15) *9/5+32));
                
                $("#" + dayNum + "date").text(month + "/" + day + "/" + year); 
                $("#" + dayNum + "forcastTemp").text("Temp: " + temp + String.fromCharCode(176)+"F");
                $("#" + dayNum + "forcastHum").text("Humidity: " + response.list[i].main.humidity);
                $("#" + dayNum + "forcastIcon").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                dayNum++; 
            }   
        }
    });

    $.ajax({
        url:currentWeatherUrl,
        method: "GET", 
    }).then(function(currentData){
        var temp = Math.round(((currentData.main.temp - 273.15) * 9/5 + 32))
        $("#currentTemp").text("Temperature: " + temp + String.fromCharCode(176)+"F");
        $("#currentHum").text("Humidity: " + currentData.main.humidity);
        $("#currentWind").text("Wind Speed: " + currentData.wind.speed);
        $("#currentIcon").attr({"src": "http://openweathermap.org/img/w/" + currentData.weather[0].icon + ".png",
            "height": "100px", "width":"100px"});
        var lon = currentData.coord.lon;
        var lat = currentData.coord.lat;

        var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?="+ key+ "&lat=" + lat +"&lon=" + lon;
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function(responseuv) {
            var cityUV = $("<span>").text(responseuv.value);
            var cityUVp = $("#currentUv").text("UV Index: ");
            cityUVp.append(cityUV);
            $("#currentUv").append(cityUVp);
            if(responseuv.value > 0 && responseuv.value <=2){
                cityUV.attr("class","green")
            }
            else if (responseuv.value > 2 && responseuv.value <= 5){
                cityUV.attr("class","yellow")
            }
            else if (responseuv.value >5 && responseuv.value <= 7){
                cityUV.attr("class","orange")
            }
            else if (responseuv.value >7 && responseuv.value <= 10){
                cityUV.attr("class","red")
            }
            else{
                cityUV.attr("class","purple")
            }
        });
     })
}
