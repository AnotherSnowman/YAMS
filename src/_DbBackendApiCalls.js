import axios from "axios";

const apiUrl = 'http://localhost:8000/imdb/api/';


function renameKeys(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    const modifiedKey = key.replace(/_([a-z])/g, function f(g) {
      return g[1].toUpperCase();
    });
    return ({
      ...acc,
      ...{ [modifiedKey]: obj[key] },
    });
  }, {});
}

export async function getStoredActors() {
  try {
    const response = await axios.get(apiUrl + 'actors/');
    const parsedData = response.data.map(item => {
      return renameKeys(item);
    })
    return parsedData;
  } catch (error) {
    console.error('Error getting actors from db:', error.message);
    throw error;
  }
}


export async function getStoredMovies() {
  try {
    const response = await axios.get(apiUrl + 'movies/');
    const parsedData = response.data.map(item => {
      return renameKeys(item);
    })
    return parsedData;
  } catch (error) {
    console.error('Error getting movies from db:', error.message);
    throw error;
  }
}

export async function getStoredRoles() {
  try {
    const response = await axios.get(apiUrl + 'roles/');
    const parsedData = response.data.map(item => {
      return renameKeys(item);
    })
    return parsedData;
  } catch (error) {
    console.error('Error getting roles from db:', error.message);
    throw error;
  }
}

async function getStoredRolesForActor(actorId) {
  try {
    const response = await axios.get(apiUrl + `actors/${actorId}/roles`);
    return response.data;
  } catch (error) {
    console.error(`Error getting roles for actor ${actorId}:`, error.message);
    throw error;
  }
}


export async function getStoredActorsAndRoles() {
  try {
    const actors = await getStoredActors();

    for (const actor of actors) {
      const roles = await getStoredRolesForActor(actor.id);

      // Print information about the actor and their roles
      console.log(`Actor: ${actor.name}`);
      console.log('Roles:', roles);
      console.log('------------------------');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
