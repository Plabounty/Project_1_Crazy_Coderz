$(document).ready(function () {

    var APIKey = 'e7610467436ab1c59773adeceb236ff7';
    populateSearch();
    defaultSearch();

    function exchangeRates() {
        var query = "http://api.currencylayer.com/live?access_key=c783200a0ae3d77071075137f56ccece";
        $.ajax({
            url: query,
            method: "GET"

        }).then(function (response) {
            console.log(response);
            $('.currency').text('Currency:' + ' USD/GBP ' + response.quotes.USDGBP + ' USD/EUR ' + response.quotes.USDEUR + ' USD/JPY ' + response.quotes.USDJPY + ' USD/RUB ' + response.quotes.USDRUB)
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
                "x-rapidapi-key": "efb9190d78msh44fd7735c9188a6p17edbfjsn0f3829e74837"
            }
        };

        $.ajax(settings).done(function (response) {
            /*feature-map */
            console.log('City: ', response);
            var coord = response.suggestions[0].entities[0];
            console.log('Coord: ', coord)
            initMap(coord.latitude, coord.longitude)

            console.log(response);
            /* develop */
            console.log('City: ', response);
            var coord = response.suggestions[0].entities[0];
            console.log('Coord: ', coord)
            $('#map').empty().append(`
            <iframe
            class="iframe"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d24823.574025673028!2d-${coord.latitude}!3d${coord.longitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1603224169167!5m2!1sen!2sus"
            width="400"
            height="300"
            frameborder="0"
            style="border: 0"
            allowfullscreen=""
            aria-hidden="false"
            tabindex="0"
          ></iframe>
            `)

            $('.hotels').text('Hotels: ' + response.suggestions[3].entities[0].name + '/' + response.suggestions[3].entities[1].name)
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
            $('.weather').text('Weather: ' + response.main.temp + ' °F')
            $('.location').text('Location: ' + response.name)

        });  
    }

    function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 39.983334, lng: -82.983330 },
            scrollwheel: true,
            zoom: 8
        });
    }

    function populateSearch() {
        var searchHistory = localStorage.getItem('searchHistory') || '[]';
        var listOfSearchHistory = [...JSON.parse(searchHistory)];
        document.getElementById("search-text").value = "";
        document.getElementById("search-list").innerHTML = "";
        for (var i = listOfSearchHistory.length - 1; i >= 0; i--) {
            var listElement = document.createElement("li");
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
        weatherCall(search)
        var searchHistory = localStorage.getItem('searchHistory') || '[]';
        var listOfSearchHistory = [...JSON.parse(searchHistory), search];
        localStorage.setItem("searchHistory", JSON.stringify(listOfSearchHistory));
        populateSearch();
    })
});
