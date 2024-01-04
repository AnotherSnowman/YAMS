import axios from "axios";

const baseURL = 'https://api.themoviedb.org/3/';

function tmdbCall(extraParams = {}) {
    let params = {
        api_key: process.env.TMDB_API_KEY
    };
    if (extraParams) {
        Object.keys(extraParams).forEach(extraParamKey => {
            params[extraParamKey] = extraParams[extraParamKey];
        })
    }

    return (
        axios.create({
            baseURL: baseURL,
            headers: {
                Accept: 'application/json'
            },
            params: params
        })
    )
}

function extractRelevantMovieDetails(movieRecord) {
    const movieDetails = {};
    movieDetails.tmdbId = movieRecord.id.toString();
    movieDetails.title = movieRecord.title;
    movieDetails.generalRating = movieRecord.vote_average;
    movieDetails.popularity = movieRecord.popularity;
    movieDetails.genres = movieRecord.genre_ids ? movieRecord.genre_ids : []; 
    if (movieRecord.poster_path) {movieDetails.posterImage = "https://image.tmdb.org/t/p/original" + movieRecord.poster_path};
    if (movieRecord.release_date) {movieDetails.year =  parseInt(movieRecord.release_date.split('-')[0])};
    if (movieRecord.imdb_id) {movieDetails.imdbID = movieRecord.imdb_id};
    return movieDetails;
}

export async function getTMDBActorMovies(actorId) {
    try {
        const apiResponse = await tmdbCall()
            .get('person/' + actorId + '/movie_credits');
        const actorCredits = apiResponse.data;

        let movieListAllDetails = actorCredits.cast ? actorCredits["cast"] : [];
        let movieListExtractedDetails = [];
        if (movieListAllDetails) {
            movieListAllDetails = movieListAllDetails.filter(movie => (
                !(movie.character.startsWith("Self") || movie.character.includes("(voice)"))
            ));
            movieListExtractedDetails = movieListAllDetails.map((movie) => {
                return extractRelevantMovieDetails(movie);
            });
        }
        return movieListExtractedDetails

    } catch (error) {
        console.error('Error getting list of TMDB movies of actor ID:' + actorId, error.message);
        throw error;
    }
}

export async function getTMDBMovieDetails(movieId) {
    try {
        const apiResponse = await tmdbCall({ append_to_response: 'credits' })
            .get('movie/' + movieId);
        const apiResponseData = apiResponse.data;
        //console.log(apiResponseData);

        let director = "";
        const actors = [];
        const peopleList = apiResponseData['credits'];
        if (peopleList["crew"]) {
            peopleList["crew"].forEach(crewMember => {
                if (crewMember.job === "Director") {
                    director = crewMember.name;
                };
            });
        };
        if (peopleList["cast"]) {
            peopleList["cast"].forEach(castMember => {
                actors.push(
                    {
                        "id": castMember.id,
                        "name": castMember.name,
                        "role": castMember.character,
                        "popularity": castMember.popularity
                    });
            });
        };

        let movieDetails = extractRelevantMovieDetails(apiResponseData);
        movieDetails.director = director;
        movieDetails.actors = actors;

        return movieDetails

    } catch (error) {
        console.error('Error getting TMDB movie details for movie ID:' + movieId, error.message);
        throw error;
    }
}
