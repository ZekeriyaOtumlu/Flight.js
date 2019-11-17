require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var axios = require("axios");
var fs = require("fs");
 


var userInput = process.argv[2];

var userSearch = process.argv.slice(3).join(" ");

console.log("userSearch:" +userInput);

// Bads in Town  Function

function getBandsInTown(artist) {

    var artist = userSearch;
    var bandInTownQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    axios.get(bandInTownQueryURL).then(
        function (response) {
            // adding a line break for clarity of when search results begin
            console.log("=============================");
            //console.log(response);
            console.log("Name of the venue: " + response.data[0].venue.name + "\n");
            console.log("Venue Location: " + response.data[0].venue.city + "\n");
            console.log("Date of event: " + moment(response.data[0].datetime).format("MM-DD-YYYY LT") + "\r\n");

            // Append text into log.txt file
            var logConcert = "==========CONCERT INFO BEGINNING HERE======" + "\n Musician Name: " + artist + "\n Name of the venue: " + response.data[0].venue.name + "\nVenue Location: " + response.data[0].venue.city + "\n Date of Event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\n======END INFO FOR CONCERT HERE======" + "\n";

            fs.appendFile("log.txt", logConcert, function (err) {
                if (err) throw err;
            });
            console.log(response);
            console.log(bandInTownQueryURL);
        });
};

// OMDB Function
function getOMDB(movie) {
    //console.log("Movie: " + movie);
    //If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    if (!movie) {
        movie = "";
    }
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    //console.log(movieQueryUrl);

    axios.get(movieQueryUrl).then(
        function (response) {
            // console.log(response.data);
            // adding a line break for clarity of when search results begin
            console.log("=============================");
            console.log("* Title of the movie: " + response.data.Title + "\n");
            console.log("* Year the movie came out: " + response.data.Year + "\n");
            console.log("* IMDB Rating of the movie: " + response.data.imdbRating + "\n");
            console.log("* Rotten Tomatoes Rating of the movie: " + response.data.Ratings[1].Value + "\n");
            console.log("* Country where the movie was produced: " + response.data.Country + "\n");
            console.log("* Language of the movie: " + response.data.Language + "\n");
            console.log("* Plot of the movie: " + response.data.Plot + "\n");
            console.log("* Actors in the movie: " + response.data.Actors + "\n");
            
            
            var logMovie = "======MOVIE INFO BEGINNING HERE======" + "\nMovie title: " + response.data.Title + "\nYear released: " + response.data.Year + "\nIMDB rating: " + response.data.imdbRating + "\nRotten Tomatoes rating: " + response.data.Ratings[1].Value + "\nCountry where produced: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors + "\n======END INFO FOR MOVIE HERE======" + "\n";

            fs.appendFile("log.txt", logMovie, function (err) {
                if (err) throw err;
            });
        });
        
};

// Spotify Function
function getSpotify(songName) {
    // Variables for the secret ids for spotify
    var spotify = new Spotify(keys.spotify);
  

    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        if(!err){
            for (let i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                console.log("Artist Name: " + songData.artists[0].name + "\nSong Name: " + songData.name + "\nPreview Song : " + songData.preview_url + "\nAlbum: " + songData.album.name);
        }
        };

        // Append text into log.txt file
        var logSong = "======SPOTIFY INFO BEGINNING HERE======" + "\nArtist: " + data.tracks.items[0].album.artists[0].name + "\nSong Name: " + data.tracks.items[0].name + "\n Preview Link: " + data.tracks.items[0].href + "\nAlbum Name: " + data.tracks.items[0].album.name + "\n======END INFO FOR SPOTIFY HERE======" + "\n";

        fs.appendFile("log.txt", logSong, function (err) {
            if (err) throw err;
        });
       
    
});
};

function runLiriApp(userInput, userSearch) {
    switch (userInput) {
        case "spotify-this-song":
            getSpotify(userSearch);
            break;

        case "concert-this":
            getBandsInTown(userSearch);
            break;

        case "movie-this":
            getOMDB(userSearch);
            break;

        case "do-what-it-says":
            getRandom();
            break;
        
        default:
            console.log("Please enter one of the following commands: 'concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says' in order to continue");
    }
};

// Log Result to log.txt file Funtion
function logResults(data) {
    fs.appendFile("log.txt", data, function (err) {
        if (err) throw err;
    });
};

function getRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);

        } else {
            console.log(data);

            var randomData = data.split(",");
            runLiriApp(randomData[0], randomData[1]);
        }
       

    });
};

runLiriApp(userInput, userSearch)



