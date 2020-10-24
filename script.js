    var APIKey = 'e7610467436ab1c59773adeceb236ff7'
    

    /* exchangeRates();
    hotelBooking();
    restaurants();
    weather(); */
    
    function exchangeRates() {
        var query = "http://api.currencylayer.com/live?access_key=c783200a0ae3d77071075137f56ccece";
            $.ajax({
              url: query,
              method: "GET"
            }).then(function (response) {
              console.log(response);
            });
          
      }


    function hotelBooking() {
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://rapidapi.p.rapidapi.com/locations/search?query=new%20york&locale=en_US",
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "hotels4.p.rapidapi.com",
                "x-rapidapi-key": "efb9190d78msh44fd7735c9188a6p17edbfjsn0f3829e74837"
            }
        };
        $.ajax(settings).done(function (response) {
            console.log(response);
        });
    }

    function restaurants() {
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://rapidapi.p.rapidapi.com/photos",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "x-rapidapi-host": "worldwide-restaurants.p.rapidapi.com",
                "x-rapidapi-key": "efb9190d78msh44fd7735c9188a6p17edbfjsn0f3829e74837"
            },
            "data": {
                "language": "en_US",
                "location_id": "15333482",
                "currency": "USD",
                "limit": "15"
            }
        };
        $.ajax(settings).done(function (response) {
            console.log(response);
        });
    }

    function weatherCall(city) {
        console.log(city)
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=' + APIKey + '&units=imperial';
        $.ajax({
            url: queryURL,
            method: 'GET'
            })
            .then(function(response) {
                console.log(queryURL)
                console.log(response) 
                $(".city").html("<h1>" + response.name + " Weather Details</h1>");
                $('.temp').text('Temperature: (F)' + response.main.temp)
                $('.humidity').text('Humidity:' + response.main.humidity)
                $('.windSpeed').text('Wind Speed:' + response.wind.speed)
                $('.clouds').text('Clouds:' + response.clouds.all)
            });
        }


    $('#search-form').on('submit', function(e){
        e.preventDefault()
        var search = $('#search-text').val()
        exchangeRates(search);
        hotelBooking(search);
        restaurants(search);
    })

    