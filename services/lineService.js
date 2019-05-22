const { LineClient, Line } = require('messaging-api-line');

const lineConfig = require('../config/lineService.json')['kirk'];
const bot = require('./botService');
const movie = require('./movieService');

const client = LineClient.connect(lineConfig);

const replyText = (token, texts) => client.replyText(token, texts);

const replyFlex = (token, contents, altText) => {
  return client.reply(token, [
    Line.createFlex(altText,
      {
        type: 'carousel',
        contents: contents.map(item => (
          {
            type: 'bubble',
            hero: {
              type: 'image',
              url: item.img,
              size: 'full',
              aspectRatio: '2:1',
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'button',
                  style: 'secondary',
                  action: {
                    type: 'uri',
                    label: 'Watch Movie',
                    uri: item.link,
                  },
                },
              ],
            },
          }
        )),
      }
    ),
  ]);
};

async function handleText (message, replyToken) {
  const text = message.text;
  const actionType = bot.getActionType(text);

  if (actionType === 'getMoviesByKeyword') {
    setTimeout(async function() {
      const content = await movie.getMoviesByKeyword(text);

      return content.length > 0 && replyFlex(replyToken, content, 'We\'ll beam down immediately, Commodore. Kirk out.');
    }, 10000);
  };

  if (actionType === 'getMovies') {
    const content = await movie.getMovies();

    return replyFlex(replyToken, content, 'Scotty, I need warp speed in three minutes or we\'re all dead.');
  }

  if (actionType === 'sendText') {
    replyText(replyToken, 'Cover! Kirk to Enterprise, lock on transporters. Beam us up.');
  };
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
