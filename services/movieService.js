const axios = require('axios');

const getMovies = async (data = { query: null, limit: 5 }) => {
  const { query, limit } = data;

  const apiEndpoint = query
    ? `https://api.avgle.com/v1/search/${encodeURIComponent(query)}/1?limit=${limit}`
    : `https://api.avgle.com/v1/videos/0?limit=${limit}`;

  try {
    const { data: { response: { videos } } } = await axios.get(apiEndpoint);

    return videos.map(video => ({
      img: video.preview_url,
      link: video.video_url,
    }));
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getMovies,
};
