$(document).ready(function () {

    var APIKey = 'e7610467436ab1c59773adeceb236ff7';
    let map;
    var latitude =0;
    var longitude =0;
    populateSearch();
    defaultSearch();

    function exchangeRates() {
        var query = "https://api.currencylayer.com/live?access_key=c783200a0ae3d77071075137f56ccece";
        $.ajax({
            url: query,
            method: "GET"

        }).then(function (response) {
            console.log(response);
            $('.currency').html('<span>Currency:</span>' + '  <span>USD/GBP</span>  ' + response.quotes.USDGBP + '  <span>USD/EUR</span>  ' + response.quotes.USDEUR + '  <span>USD/JPY</span>  ' + response.quotes.USDJPY + '  <span>USD/RUB</span>  ' + response.quotes.USDRUB)
        });
    }

    function hotelBooking(city) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://hotels4.p.rapidapi.com/locations/search?locale=en_US&query=" + city,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "hotels4.p.rapidapi.com",
                "x-rapidapi-key": "d1d3ee5eccmsh8bdee8240526fecp19e054jsn60d5b59645ff"
            }
        };

        $.ajax(settings).done(function (response) {
            $('.hotels').html('<span>Hotels:</span> ' + response.suggestions[3].entities[0].name + '/' + response.suggestions[3].entities[1].name)
        });
    };


    function weatherCall(city) {
        console.log(city)
        var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey + '&units=imperial';

        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            console.log(queryURL)
            console.log(response)
            $('.weather').html('<span>Weather:</span> ' + response.main.temp + ' °F')
            $('.location').html('<span>Location:</span> ' + response.name)
            initMap(response.coord.lat, response.coord.lon);

        });  
    }

    // function initMap(lati,long) {
    //     map = new google.maps.Map(document.getElementById('map'), {
    //         center: { lat: lati, lng: long },
    //         scrollwheel: true,
    //         zoom: 8
    //     });
    // }

    function populateSearch() {
        var searchHistory = localStorage.getItem('searchHistory') || '[]';
        var listOfSearchHistory = [...JSON.parse(searchHistory)];
        document.getElementById("search-text").value = "";
        document.getElementById("search-list").innerHTML = "";
        var count = 10;
        if (listOfSearchHistory.length < count) {
            count = listOfSearchHistory.length;
        }
        for (var i = listOfSearchHistory.length - 1; i >= listOfSearchHistory.length - count; i--) {
            var listElement = document.createElement("li");
            listElement.setAttribute("class", "collection-item")
            var clickableElement = document.createElement("a");
            clickableElement.href = "#";
            clickableElement.textContent = listOfSearchHistory[i];
            document.getElementById("search-list").appendChild(listElement);
            listElement.appendChild(clickableElement);
            clickableElement.onclick = searchCity;
        }
    }

    function searchCity() {
        var search = this.textContent;
        exchangeRates(search);
        hotelBooking(search);
        weatherCall(search);
        var searchHistory = localStorage.getItem('searchHistory') || '[]';
        var listOfSearchHistory = [...JSON.parse(searchHistory), search];
        localStorage.setItem("searchHistory", JSON.stringify(listOfSearchHistory));
        populateSearch();
    }


    function defaultSearch() {
        var searchHistory = localStorage.getItem('searchHistory') || '[]';
        var listOfSearchHistory = [...JSON.parse(searchHistory)];
        search = listOfSearchHistory[listOfSearchHistory.length - 1];
        exchangeRates(search);
        hotelBooking(search);
        weatherCall(search);
    }

    $('#search-form').on('submit', function (e) {
        e.preventDefault()
        var search = $('#search-text').val()
        exchangeRates(search);
        hotelBooking(search);
        weatherCall(search);
        var searchHistory = localStorage.getItem('searchHistory') || '[]';
        var listOfSearchHistory = [...JSON.parse(searchHistory), search];
        localStorage.setItem("searchHistory", JSON.stringify(listOfSearchHistory));
        populateSearch();
    })
});

function initMap(lati,long) {
    var parseLat = parseFloat(lati)
    var parseLon = parseFloat(long)
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: parseLat, lng: parseLon },
        scrollwheel: true,
        zoom: 8
        
    });
}
