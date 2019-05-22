const axios = require('axios');

async function getMovies (limit = 5) {
  try {
    const result = await axios.get(`https://api.avgle.com/v1/videos/0?limit=${limit}`);
    const viedos = result.data.response.videos;
    const movies = viedos.map(video => ({
      img: video.preview_url,
      link: video.video_url,
    }));

    return movies;
  } catch (error) {
    console.log(error);
  }
}

async function getMoviesByKeyword (query, limit = 5) {
  try {
    const result = await axios.get(`https://api.avgle.com/v1/search/${encodeURIComponent(query)}/1?limit=${limit}`);
    const viedos = result.data.response.videos;
    const movies = viedos.map(video => ({
      img: video.preview_url,
      link: video.video_url,
    }));

    return movies;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getMovies,
  getMoviesByKeyword,
};
