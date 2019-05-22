const getActionType = text => {
  const actions = {
    type1: 'sendText',
    type2: 'sendMovie',
  };

  if (text.includes('วาร์ป')) {
    return actions.type2;
  }

  return actions.type1;
};

module.exports = {
  getActionType,
};
