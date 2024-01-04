import './App.css';
import ActorRatingView from './_ActorRating';
import { CssVarsProvider } from '@mui/joy/styles';
import { Box, Container } from '@mui/system';
import CssBaseline from '@mui/joy/CssBaseline';
import { useEffect, useState } from "react";
import { getStoredMovies, getStoredRoles, getStoredActors } from './_DbBackendApiCalls';
import { getTMDBActorMovies } from './_TMDBApiCalls';

function App() {


  const [storedMovies, setStoredMovies] = useState([]);
  const [storedActors, setStoredActors] = useState([]);
  const [storedRoles, setStoredRoles] = useState([]);
  const [storedDataFetched, setStoredDataFetched] = useState(false);

  // Get current state from database
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
    getDatabaseState();
    return () => { };
  }, []);


  // Test & Mockup section
  const testMovie = {
    id: 27205,
    title: "Inception"
  }
  const testActor = {
    id: 6193,
    name: "Leonardo DiCaprio"
  }

  /* TODO - Next steps: 
  1. call ActorMovies from TMDB ✅
  2. filter response with genre Blacklist / Whitelist ✅
  2.1 calculate likelihood for already stored movies ✅
  2.2 create storedMovies entries for new movies
  3. call MovieDetails from TMDB to get all actors for the filtered movies 
  4. sort list by actor popularity 
  5. filter out Top-20 actors
  6. create db entries for the queried movies, actors and movie-actor relationships
  6.1 check if the entry already exists ✅
  6.2 create db entries
  */


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

