import axios from "axios";

const BASE_URL = "https://customsearch.googleapis.com/customsearch/v1";
const API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const SEARCH_ENGINE_KEY = process.env.GOOGLE_SEARCH_ENGINE_KEY;

export async function apiCallForRoleImages (searchTerm) {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        cx: SEARCH_ENGINE_KEY,
        q: searchTerm,
        searchType: 'image'
      },
    });
    return response.data.items;
  };