const { LineClient } = require('messaging-api-line');

const lineConfig = require('../config/lineService.json')['kirk'];
const bot = require('./botService');
const movie = require('./movieService');

const Line = LineClient.connect(lineConfig);

const replyText = (token, texts) => {
  console.log('Reply text');
  texts = Array.isArray(texts) ? texts : [texts];

  return Line.replyText(
    token,
    texts.map(text => ({ type: 'text', text }))
  );
};

const replyFlex = (token, contents) => {
  console.log('Reply flex');
  return Line.replyFlex(
    token,
    'This is a flex.',
    contents.map(item => (
      {
        'type': 'bubble',
        'hero': {
          'type': 'image',
          'url': item.img,
          'size': 'full',
          'aspectRatio': '2:1',
        },
        'footer': {
          'type': 'box',
          'layout': 'vertical',
          'contents': [
            {
              'type': 'button',
              'style': 'secondary',
              'action': {
                'type': 'uri',
                'label': 'Watch Movie',
                'uri': item.link,
              },
            },
          ],
        },
      }
    ))
  );
};

async function handleText (message, replyToken) {
  const actionType = bot.getActionType(message.text);

  if (actionType === 'sendSurvey') {
    console.log('Send Survey');
    return replyText(replyToken, 'Send Survey');
  };

  if (actionType === 'sendMovie') {
    console.log('Send Movie');
    const content = await movie.getMovies();

    return replyFlex(replyToken, content);
  }
};

function handleEvent(event) {
  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

module.exports = {
  handleEvent,
};