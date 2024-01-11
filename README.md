# YAMS
Yet Another Movie Suggestor. <br>
The user keeps rating suggested movies and actors. _Woah!_ <br>
After a few rounds, YAMS will definitely come up with some gems: Unseen, unpopular, yet critically acclaimed movies starring dozens of beloved actors.<br><br>
<img src="https://github.com/AnotherSnowman/YAMS/assets/153401230/56f84c56-c05d-4468-8f2a-1b336865f2b9" width="150" />

## Dare to try?!
### Prerequisites
- TMDB API key
- IMDB data dump [TODO]

Nice to have, for including actor role images:
- Google Custom Search JSON API key & Programmable Search Engine instance
- and / or Bing Search API key

### Deployment
1. Download the code / clone the rep
2. Run npm install inside the root folder to install all dependencies as declared in /package.json
3. Populate the .env file with your API keys (if you don't want to add a Google or Bing API key, set the respective constants to '')
4. Download the IMDB data dumps and save the unzipped files to [TODO]
5. (Optional) In the .env file, add the address of your this_Django_app[LINK NEEDED] database backend. See more below. [TODO]
6. Start the app, e.g. through 'npm start' from within the root folder.

## Technologies / Libraries included
- React / NodeJS (Create-React-App bundle)
- MUI Joy
- Axios
- Zustand (to-be-done)
- Jest & RTL (to-be-ditched)
