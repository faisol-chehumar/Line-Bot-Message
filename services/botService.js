const getActionType = text => {
  const actions = {
    type1: 'getMoviesByKeyword',
    type2: 'getMovies',
  };

  if (text.includes('วาร์ป')) {
    return actions.type2;
  }

  return actions.type1;
};

module.exports = {
  getActionType,
};
