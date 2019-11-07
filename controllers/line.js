const {
  handleEvent,
  broadcast,
} = require('../services/lineService');

exports.broadcast = (userIds, text) => {
  broadcast(userIds, text);
};

exports.webhook = (event) => {
  handleEvent();
};
