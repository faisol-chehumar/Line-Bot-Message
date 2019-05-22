const getActionType = text => {
  const actions = {
    type1: 'getMoviesByKeyword',
    type2: 'getMovies',
    type3: 'sendText',
    type4: 'sendMap',
  };

  if (text.includes('ทำไมเรายังไม่วาร์ป')) {
    return actions.type3;
  }

  if (text.includes('วาร์ป')) {
    return actions.type2;
  }

  if (text.includes('ลายแทง')) {
    return actions.type4;
  }

  return actions.type1;
};

module.exports = {
  getActionType,
};
