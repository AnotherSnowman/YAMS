import axios from "axios";

const DATABASE_ADDRESS = process.env.REACT_APP_DATABASE_ADDRESS;

// if (process.env.REACT_APP_DATABASE_ADDRESS) {
//   DATABASE_ADDRESS = process.env.REACT_APP_DATABASE_ADDRESS;
// }

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
    const response = await axios.get(DATABASE_ADDRESS + 'actors/');
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
    const response = await axios.get(DATABASE_ADDRESS + 'movies/');
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
      const response = await axios.get(DATABASE_ADDRESS + 'roles/');
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
      const response = await axios.get(DATABASE_ADDRESS + `actors/${actorId}/roles`);
      return response.data;
    } catch (error) {
      console.error(`Error getting roles for actor ${actorId}:`, error.message);
      throw error;
    }
}
