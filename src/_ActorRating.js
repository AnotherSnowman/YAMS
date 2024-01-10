import './App.css';
import { useEffect, useState } from "react";

import { Box, Container } from '@mui/system';
import InfoIcon from '@mui/icons-material/Info';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Grid from '@mui/joy/Grid';
import Radio from '@mui/joy/Radio';
import Alert from '@mui/joy/Alert';
import RadioGroup from '@mui/joy/RadioGroup';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Autocomplete from '@mui/joy/Autocomplete';
import Typography from '@mui/joy/Typography';

import { getTMDBActorMovies } from './_TMDBApiCalls';
import { apiCallForRoleImages } from './_ImageSearchApiCalls';


export function ActorCard({ actor, allChanges }) {

    const [ratingValue, setRatingValue] = useState("0");
    const [actorImageURLs, setActorImageURLs] = useState([]);
    const [rolesInSeenMovies, setRolesInSeenMovies] = useState(() => {
        let rolesToBePushed = [];
        actor.roles.forEach((role) => {
            if (role.movieDetails.seen) {
                const movieRoleTuple = {
                    movie: role.movieDetails.title,
                    role: role.role
                };
                rolesToBePushed.push(movieRoleTuple);
                if (role.imageUrl !== "") { setActorImageURLs([...actorImageURLs, role.imageUrl]) }
            };
        })
        return rolesToBePushed;
    });

    let queryActorImagesAPI = true;
    if (process.env.REACT_APP_EXCLUDE_IMAGE_API_SEARCH) { queryActorImagesAPI = false; }

    function handleRatingChange(event) {
        let newRatingValue = ratingValue;
        newRatingValue = event.target.value;
        setRatingValue(newRatingValue);
        allChanges.ratings[actor.id] = newRatingValue;
        // Carry over currently selected picture of the actor, if available.
        if (actor.imageUrl) { allChanges.images[actor.id] = actor.imageUrl };
    }

    async function searchForActorRoleImages(searchTerm) {
        //Nice-to-have: Add interaction to let user switch between roles / between images of a role.
        //TODO: Put " " around role name to improve image search algorithm.
        const searchResults = await (apiCallForRoleImages(searchTerm));
        console.log("===== Google API contacted =====");
        let extractedImages = [];
        for (const searchResult of searchResults) {
            if (extractedImages.length < 5) { extractedImages.push(searchResult.link) }
            else { break }
        }
        setActorImageURLs(extractedImages);
    }

    useEffect(() => {
        if (!(actorImageURLs.length) && rolesInSeenMovies.length && queryActorImagesAPI) {
            searchForActorRoleImages(rolesInSeenMovies[0].role + " (" + rolesInSeenMovies[0].movie + ")");
        };
    }, [actorImageURLs, queryActorImagesAPI, rolesInSeenMovies]);

    return (
        <Grid container spacing={2} sx={{ p: 2, border: '1px dashed lightgrey' }}>

            <Grid xs={12} md={5} sx={{ height: '33vh' }}>
                <img alt="Actor in role" src={actorImageURLs[0]}>
                </img>
            </Grid>
            <Grid xs={12} md={7}>
                <Box sx={{ pb: 2 }}>
                    <strong>{actor.name}</strong><br />
                    <span>Seen in:
                    </span>
                    <List marker="disc">
                        {rolesInSeenMovies.map((roleInMovie, index) => {
                            return <ListItem key={roleInMovie.movie + roleInMovie.role}>
                                <span>{roleInMovie.movie}: </span>
                                <span style={{ display: 'Inline-Block' }}>{roleInMovie.role}</span>
                            </ListItem>
                        }
                        )}

                    </List>
                </Box>
                <Box sx={{ pb: 2 }}>
                    <FormControl>
                        <FormLabel><strong>Rating:</strong></FormLabel>
                        <RadioGroup
                            onChange={(event) => handleRatingChange(event, actor.id)}
                            value={ratingValue}
                            name="actor-rating-buttons-group"
                            sx={{ fontWeight: 'bold' }}
                        >
                            <Radio value="5" label="❤️‍🔥" sx={{ color: 'forestgreen' }} />
                            <Radio value="4" label="Good" sx={{ color: 'lightgreen' }} />
                            <Radio value="3" label="Okayish" sx={{ color: 'orange' }} />
                            <Radio value="2" label="Annoying" sx={{ color: 'red' }} />
                            <Radio value="1" label="Don't remember.." sx={{ color: 'grey' }} />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </Grid>
        </Grid >
    )
}

export default function ActorRatingView({
    storedMovies,
    setStoredMovies,
    storedActors,
    setStoredActors,
    storedRoles }) {

    const [unratedActors, setUnratedActors] = useState(getUnratedActors());
    const [prevStoredActors, setPrevStoredActors] = useState(storedActors);

    if (prevStoredActors !== storedActors) {  // Needed to enable re-init of 'unratedActors' when storedActors has changed
        setPrevStoredActors(storedActors);
        setUnratedActors(getUnratedActors());
    }

    function getUnratedActors() {
        return (storedActors
            .filter(actor => (actor.userRating === 0))
            .map(actor => {
                let actorRoles = storedRoles.filter(role => role.actor === actor.id);
                if (actorRoles) {
                    actorRoles.forEach(role => {
                        role.movieDetails = storedMovies.find(movie => movie.id === role.movie);
                    })
                    actor.roles = actorRoles;
                    return actor;
                }
                else {
                    console.error("No roles found for actor " + actor);
                    return null;
                }
            }))
    }

    // Likelihood calculation parameters
    const genreFactor = 8;  // Example: 1x3⭐ + 2x1⭐ = 1.66⭐ Genres result in 13.33 points 
    const popularityFactor = 0.2;  // Note: Popularity base value ranges btw 0 - >100 points. 
    const generalRatingFactor = 3.5; // Note: GeneralRating base value ranges btw 0 - 10 points.
    const actorRatingFactor = {
        //ID from rating radio buttons : --> Points for movie likelihood 
        5: 10,
        4: 2,
        2: -5
    };


    // TODO - Init Genre IDs through API call, see https://developer.themoviedb.org/reference/genre-movie-list 
    const genreSettings = { // 0 = No-Go, 1 = Acceptable, 2 = Preferable, 3 = Must-Have
        Action: {
            id: 28,
            preference: 1,
        },
        Adventure: {
            id: 12,
            preference: 1,
        },
        Animation: {
            id: 16,
            preference: 2,
        },
        Comedy: {
            id: 35,
            preference: 2,
        },
        Crime: {
            id: 80,
            preference: 1,
        },
        Documentary: {
            id: 99,
            preference: 0,
        },
        Drama: {
            id: 18,
            preference: 3,
        },
        Family: {
            id: 10751,
            preference: 2,
        },
        Fantasy: {
            id: 14,
            preference: 1,
        },
        History: {
            id: 36,
            preference: 3,
        },
        Horror: {
            id: 27,
            preference: 0,
        },
        Music: {
            id: 10402,
            preference: 1,
        },
        Mystery: {
            id: 9648,
            preference: 1,
        },
        Romance: {
            id: 10749,
            preference: 3,
        },
        Science_Fiction: {
            id: 878,
            preference: 1,
        },
        Thriller: {
            id: 53,
            preference: 1,
        },
        TV_Movie: {
            id: 10770,
            preference: 1,
        },
        War: {
            id: 10752,
            preference: 1,
        },
        Western: {
            id: 37,
            preference: 0,
        },
    }
    let genreIdIgnoreList = [];
    let genreIdMustHaveList = [];
    Object.keys(genreSettings).forEach(genre => {
        if (genreSettings[genre].preference === 0) { genreIdIgnoreList.push(genreSettings[genre].id); }
        else if (genreSettings[genre].preference > 1) { genreIdMustHaveList.push(genreSettings[genre].id); }
    });

    async function addNewMovies(actor) {
        const allActorMovies = await getTMDBActorMovies(actor.tmdbId);
        let updatedMovies = [];

        let filteredMovies = allActorMovies.filter(movie => (
            movie.genres.some(genre =>
                genreIdMustHaveList.includes(genre))
            && !(movie.genres.some(genre =>
                genreIdIgnoreList.includes(genre)))
            && !(storedMovies.find(storedMovie => movie.tmdbId === storedMovie.tmdbId))
        ));


        filteredMovies.forEach(movie => {
            if (actor.userRating !== 2) { movie.hasLikedActor = true };
            // .hasLikedActor property is set to 'false' by default 
            // to avoid suggesting movies that were added through disliked actors.
            // Only movies with the flag set to 'true' will be visible in Movie selections.

            let totalLikelihood = 0.0;

            let genreCombinedLikelihood = 0.0;
            let genresLeft = [...movie.genres];
            for (const genreKey of Object.keys(genreSettings)) {
                let genresLeftNew = genresLeft.filter(genre => genre !== (genreSettings[genreKey].id));
                if (!(genresLeftNew.length === genresLeft.length)) {
                    genreCombinedLikelihood += (genreSettings[genreKey].preference);
                    if (!genresLeftNew.length) {
                        totalLikelihood += genreCombinedLikelihood / movie.genres.length * genreFactor;
                        break;
                    }
                    genresLeft = genresLeftNew;
                }
            }

            switch (actor.userRating) {
                case 5:
                    totalLikelihood += actorRatingFactor[5];
                    break;
                case 4:
                    totalLikelihood += actorRatingFactor[4];
                    break;
                case 2:
                    totalLikelihood += actorRatingFactor[2];
                    break;
                default:
                    break;
            }

            totalLikelihood += movie.popularity * popularityFactor;
            totalLikelihood += movie.generalRating * generalRatingFactor;
            movie.likelihood = totalLikelihood;

        })
        setStoredMovies(previousState => [...previousState, ...filteredMovies]);  // Ref: https://stackoverflow.com/questions/57828368/why-react-usestate-with-functional-update-form-is-needed

    };

    let allActorCardsChanges = { ratings: {}, images: {} };

    function updateActorsAndMovies() {
        if (Object.keys(allActorCardsChanges.ratings).length !== 0) {

            let updatedActors = structuredClone(storedActors);  // Ref: https://stackoverflow.com/questions/47624142/right-way-to-clone-objects-arrays-during-setstate-in-react
            let updatedMovies = [];

            Object.keys(allActorCardsChanges.ratings).forEach((key) => {
                const actorId = parseInt(key);
                const newRating = parseInt(allActorCardsChanges.ratings[key]);

                for (const a in updatedActors) {
                    if (updatedActors[a].id === actorId) {
                        updatedActors[a].userRating = newRating;

                        // Search for unseen movies of the actor to update their likelihood rating.
                        // Only search if the actor was rated bad (2) or good (4/5). Neutral ratings don't influence the likelihood.
                        if ([2, 4, 5].includes(newRating)) {
                            for (const m in storedMovies) {
                                if (storedMovies[m].actors && storedMovies[m].actors.find(actor => actor === actorId)) { // Found a movie where we need to update the likelihood.
                                    //Nice to have: Get control over whether this actor got re-evaluated and substract the previous likelihood addition.
                                    if (!updatedMovies.length) { updatedMovies = structuredClone(storedMovies); }
                                    switch (newRating) {
                                        case 5:
                                            updatedMovies[m].likelihood += actorRatingFactor[5];
                                            break;
                                        case 4:
                                            updatedMovies[m].likelihood += actorRatingFactor[4];
                                            break;
                                        case 2:
                                            updatedMovies[m].likelihood += actorRatingFactor[2];
                                            break;
                                        default:
                                            break;
                                    }
                                    if (newRating !== 2) { updatedMovies[m].hasLikedActors = true };
                                    // .hasLikedActor property is set to 'false' by default 
                                    // to avoid suggesting movies that were added through disliked actors.
                                    // Only movies with the flag set to 'true' will be visible in Movie selections.
                                }
                            };
                            addNewMovies(updatedActors[a]);
                        }
                        break;
                    }
                }
            });

            if (updatedMovies.length) { setStoredMovies(updatedMovies); }
            setStoredActors(updatedActors);
        }
    }

    return (
        <div id="ActorRatingContainer">

            {unratedActors.length !== 0
                ? <Container maxWidth="md" sx={{ my: '10px' }}>

                    {/* MovieFilter */}
                    <Box justifyContent="center" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', my: 2 }}>
                        <Autocomplete
                            placeholder="Movie (optional)"
                            options={
                                storedMovies
                                    .filter(movie => (movie.seen && movie.hasLikedActors))
                                    .map(movie => { return movie.title + " [" + movie.year + "]"; })
                            }
                            sx={{ width: 300 }}
                        />
                    </Box>

                    {/* ActorCards */}
                    <Box component="section" >
                        <div>
                            {unratedActors.map((actor, index) => {
                                if (index < 5) {
                                    return (<ActorCard key={actor.id} actor={actor} allChanges={allActorCardsChanges} />) // Important to always refer a key property within the passed object 
                                }
                                else { return (''); }
                            })}
                        </div>
                    </Box>

                    {/* Actions */}
                    <Box
                        justifyContent="center" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>

                        <Button variant="plain" className="ActorRatingButton" id="ActorRatingShowMore">
                            Show more
                        </Button>
                        <Button variant="plain" className="ActorRatingButton" id="ActorRatingSubmission" onClick={updateActorsAndMovies}>
                            Submit
                        </Button>
                        <Button variant="plain" className="ActorRatingButton" id="ActorRatingClear">
                            Clear
                        </Button>
                    </Box>

                </Container>

                : <Box display="flex" sx={{ justifyContent: "center" }} my={4} >
                    <Alert startDecorator={<InfoIcon />} color='primary' variant='soft' sx={{ alignItems: 'flex-start' }} >
                        <div>
                            <div><strong>No actors available for rating</strong></div>
                            <Typography level="body-sm">Please, rate more movies to get more actors.</Typography>
                        </div>
                    </Alert>
                </Box>
            }

            <Divider />

        </div>
    );
}


