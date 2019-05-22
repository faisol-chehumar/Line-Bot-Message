const getActionType = text => {
  const actions = {
    type1: 'sendMovie',
    type2: 'sendSurvey',
  };

  if (text.includes('วาร์ป')) {
    return actions.type1;
  }
};

module.exports = {
  getActionType,
};
