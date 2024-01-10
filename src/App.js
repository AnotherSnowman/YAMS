import './App.css';
import ActorRatingView from './_ActorRating';
import { CssVarsProvider } from '@mui/joy/styles';
import { Box } from '@mui/system';
import CssBaseline from '@mui/joy/CssBaseline';
import { useEffect, useState } from "react";
import { getStoredMovies, getStoredRoles, getStoredActors } from './_DbBackendApiCalls';

function App() {


  const [storedMovies, setStoredMovies] = useState([]);
  const [storedActors, setStoredActors] = useState([]);
  const [storedRoles, setStoredRoles] = useState([]);
  const [storedDataFetched, setStoredDataFetched] = useState(false);

  // Get current state from database -OR- fill state with sample data
  useEffect(() => {
    async function getDatabaseState() {
      try {
        setStoredRoles(await getStoredRoles());
        setStoredActors(await getStoredActors());
        setStoredMovies(await getStoredMovies());
        setStoredDataFetched(true);
      }
      catch (error) {
        console.error(error);
      }
    }

    if (process.env.REACT_APP_DATABASE_ADDRESS) {
      getDatabaseState();
    }
    else {
      setStoredRoles(
        [
          {
            "id": 1,
            "role": "Cobb",
            "knownFor": true,
            "imageUrl": "",
            "actor": 1,
            "movie": 1,
            "movieDetails": {
              "id": 1,
              "title": "Inception",
              "imdbId": "tt1375666",
              "tmdbId": "27205",
              "hasLikedActors": false,
              "seen": true,
              "userRating": 4,
              "generalRating": 8,
              "year": 2010,
              "director": "Christopher Nolan",
              "popularity": 90,
              "likelihood": 0,
              "actors": [
                1
              ]
            }
          },
          {
            "id": 2,
            "role": "Freddie",
            "knownFor": true,
            "imageUrl": "",
            "actor": 1,
            "movie": 3,
            "movieDetails": {
              "id": 3,
              "title": "Shutter Island",
              "imdbId": "",
              "tmdbId": "11324",
              "hasLikedActors": false,
              "seen": true,
              "userRating": 0,
              "generalRating": 8,
              "year": 2010,
              "director": "Christopher Nolan",
              "popularity": 93,
              "likelihood": 0,
              "actors": [
                1,
                2
              ]
            }
          },
          {
            "id": 3,
            "role": "Dolores Chanal",
            "knownFor": false,
            "imageUrl": "",
            "actor": 2,
            "movie": 3,
            "movieDetails": {
              "id": 3,
              "title": "Shutter Island",
              "imdbId": "",
              "tmdbId": "11324",
              "hasLikedActors": false,
              "seen": true,
              "userRating": 0,
              "generalRating": 8,
              "year": 2010,
              "director": "Christopher Nolan",
              "popularity": 93,
              "likelihood": 0,
              "actors": [
                1,
                2
              ]
            }
          },
          {
            "id": 4,
            "role": "Mrs. Feedy",
            "knownFor": false,
            "imageUrl": "",
            "actor": 2,
            "movie": 2,
            "movieDetails": {
              "id": 2,
              "title": "The Shawshank Redemption",
              "imdbId": "tt0111161",
              "tmdbId": "278",
              "hasLikedActors": true,
              "seen": true,
              "userRating": 2,
              "generalRating": 9,
              "year": 1994,
              "director": "Frank Darabont",
              "popularity": 95,
              "likelihood": 0,
              "actors": [
                2
              ]
            }
          }
        ]
      );
      setStoredActors(
        [
          {
            "id": 1,
            "name": "Leonardo DiCaprio",
            "imdbId": "nm0000138",
            "tmdbId": "6193",
            "userRating": 0,
            "popularity": 95,
            "likelihood": 0,
            "roles": [
              {
                "id": 1,
                "role": "Cobb",
                "knownFor": true,
                "imageUrl": "",
                "actor": 1,
                "movie": 1,
                "movieDetails": {
                  "id": 1,
                  "title": "Inception",
                  "imdbId": "tt1375666",
                  "tmdbId": "27205",
                  "hasLikedActors": false,
                  "seen": true,
                  "userRating": 4,
                  "generalRating": 8,
                  "year": 2010,
                  "director": "Christopher Nolan",
                  "popularity": 90,
                  "likelihood": 0,
                  "actors": [
                    1
                  ]
                }
              },
              {
                "id": 2,
                "role": "Freddie",
                "knownFor": true,
                "imageUrl": "",
                "actor": 1,
                "movie": 3,
                "movieDetails": {
                  "id": 3,
                  "title": "Shutter Island",
                  "imdbId": "",
                  "tmdbId": "11324",
                  "hasLikedActors": false,
                  "seen": false,
                  "userRating": 0,
                  "generalRating": 8,
                  "year": 2010,
                  "director": "Christopher Nolan",
                  "popularity": 93,
                  "likelihood": 0,
                  "actors": [
                    1,
                    2
                  ]
                }
              }
            ]
          },
          {
            "id": 2,
            "name": "Lisa Kudrow",
            "imdbId": "nm0001435",
            "tmdbId": "14406",
            "userRating": 0,
            "popularity": 85,
            "likelihood": 0,
            "roles": [
              {
                "id": 3,
                "role": "Dolores Chanal",
                "knownFor": false,
                "imageUrl": "",
                "actor": 2,
                "movie": 3,
                "movieDetails": {
                  "id": 3,
                  "title": "Shutter Island",
                  "imdbId": "",
                  "tmdbId": "11324",
                  "hasLikedActors": false,
                  "seen": false,
                  "userRating": 0,
                  "generalRating": 8,
                  "year": 2010,
                  "director": "Christopher Nolan",
                  "popularity": 93,
                  "likelihood": 0,
                  "actors": [
                    1,
                    2
                  ]
                }
              },
              {
                "id": 4,
                "role": "Mrs. Feedy",
                "knownFor": false,
                "imageUrl": "",
                "actor": 2,
                "movie": 2,
                "movieDetails": {
                  "id": 2,
                  "title": "The Shawshank Redemption",
                  "imdbId": "tt0111161",
                  "tmdbId": "278",
                  "hasLikedActors": true,
                  "seen": true,
                  "userRating": 2,
                  "generalRating": 9,
                  "year": 1994,
                  "director": "Frank Darabont",
                  "popularity": 95,
                  "likelihood": 0,
                  "actors": [
                    2
                  ]
                }
              }
            ]
          }
        ]
      );
      setStoredMovies(
        [
          {
            "id": 1,
            "title": "Inception",
            "imdbId": "tt1375666",
            "tmdbId": "27205",
            "hasLikedActors": false,
            "seen": true,
            "userRating": 4,
            "generalRating": 8,
            "year": 2010,
            "director": "Christopher Nolan",
            "popularity": 90,
            "likelihood": 0,
            "actors": [
              1
            ]
          },
          {
            "id": 2,
            "title": "The Shawshank Redemption",
            "imdbId": "tt0111161",
            "tmdbId": "278",
            "hasLikedActors": true,
            "seen": true,
            "userRating": 2,
            "generalRating": 9,
            "year": 1994,
            "director": "Frank Darabont",
            "popularity": 95,
            "likelihood": 0,
            "actors": [
              2
            ]
          },
          {
            "id": 3,
            "title": "Shutter Island",
            "imdbId": "",
            "tmdbId": "11324",
            "hasLikedActors": true,
            "seen": true,
            "userRating": 7,
            "generalRating": 8,
            "year": 2010,
            "director": "Christopher Nolan",
            "popularity": 93,
            "likelihood": 0,
            "actors": [
              1,
              2
            ]
          },
          {
            "id": 4,
            "title": "Pulp Fiction",
            "imdbId": "tt0110912",
            "tmdbId": "680",
            "hasLikedActors": false,
            "seen": false,
            "userRating": 2,
            "generalRating": 8,
            "year": 1994,
            "director": "Quentin Tarantino",
            "popularity": 88,
            "likelihood": 0,
            "actors": []
          }
        ]
      );
      setStoredDataFetched(true);
    }

    return () => { };
  }, []);


  return (

    <CssVarsProvider>
      <CssBaseline />
      {/* Final App */}
      <Box textAlign="center">
        <p>Movies: {storedMovies.length} | Actors: {storedActors.length} | Roles: {storedRoles.length}</p>
      </Box>
      <div>
        {storedDataFetched
          ? <div> <ActorRatingView
            storedActors={storedActors}
            setStoredActors={setStoredActors}
            storedMovies={storedMovies}
            setStoredMovies={setStoredMovies}
            storedRoles={storedRoles} /> </div>
          : <p>LOADING!</p>
        }
      </div>
    </CssVarsProvider>

  );

}

export default App;

