const { LineClient } = require('messaging-api-line');

const lineConfig = require('../config/lineService.json')['kirk'];
const bot = require('./botService');
const movie = require('./movieService');

const client = LineClient.connect(lineConfig);

const replyText = (token, texts) => client.replyText(token, texts);

const replyFlex = (token, contents) => {
  console.log('Reply flex');
  // const flexContent = contents.map(item => (
  //   Line.createFlex(
  //     'This is Flex.',
  //     {
  //       'type': 'bubble',
  //       'hero': {
  //         'type': 'image',
  //         'url': item.img,
  //         'size': 'full',
  //         'aspectRatio': '2:1',
  //       },
  //       'footer': {
  //         'type': 'box',
  //         'layout': 'vertical',
  //         'contents': [
  //           {
  //             'type': 'button',
  //             'style': 'secondary',
  //             'action': {
  //               'type': 'uri',
  //               'label': 'Watch Movie',
  //               'uri': item.link,
  //             },
  //           },
  //         ],
  //       },
  //     }
  //   )
  // ));

  // console.log(flexContent);
  return client.replyImageCarouselTemplate(
    token,
    'this is an image carousel template',
    [
      {
        imageUrl: 'https://example.com/bot/images/item1.jpg',
        action: {
          type: 'postback',
          label: 'Buy',
          data: 'action=buy&itemid=111',
        },
      },
      {
        imageUrl: 'https://example.com/bot/images/item2.jpg',
        action: {
          type: 'message',
          label: 'Yes',
          text: 'yes',
        },
      },
      {
        imageUrl: 'https://example.com/bot/images/item3.jpg',
        action: {
          type: 'uri',
          label: 'View detail',
          uri: 'http://example.com/page/222',
        },
      },
    ]
  );
};

async function handleText (message, replyToken) {
  const actionType = bot.getActionType(message.text);
  console.log('actionType>>>', actionType);
  if (actionType === 'sendText') {
    console.log('Send Text', message.text);
    return replyText(replyToken, message.text);
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
          console.log('Handle Event');
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
