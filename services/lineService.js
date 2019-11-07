const {
  LineClient,
  // Line
} = require('messaging-api-line');

const lineConfig = require('../config/lineService.json')['kirk'];
const { isAllEnglish } = require('../utils/helpers');
const bot = require('./botService');
const movie = require('./movieService');

const client = LineClient.connect(lineConfig);
// console.log(client)

// const actions = {
//   replyText: (token, texts) => client.replyText(token, texts),
//   replyFlex: (token, contents, altText) => {
//     return client.reply(token, [
//       Line.createFlex(altText, {
//         type: 'carousel',
//         contents: contents.map(item => ({
//           type: 'bubble',
//           hero: {
//             type: 'image',
//             url: item.img,
//             size: 'full',
//             aspectRatio: '2:1',
//           },
//           footer: {
//             type: 'box',
//             layout: 'vertical',
//             contents: [{
//               type: 'button',
//               style: 'secondary',
//               action: {
//                 type: 'uri',
//                 label: 'Watch Movie',
//                 uri: item.link,
//               },
//             }],
//           },
//         })),
//       }),
//     ]);
//   },
//   replyTemplate: (token, link) => {
//     return client.replyTemplate(token, 'Sometimes a feeling is all we humans have to go on', {
//       type: 'buttons',
//       thumbnailImageUrl: 'https://timedotcom.files.wordpress.com/2016/07/gettyimages-542423158.jpg',
//       title: 'KAPOO MAP',
//       text: 'OPEN MAP',
//       actions: [{
//         type: 'uri',
//         label: 'View detail',
//         uri: link,
//       }],
//     });
//   },
// };

async function handleText ({ text }, replyToken, actions) {
  if (!isAllEnglish(text)) {
    return;
  }

  const actionType = bot.getActionType(text);

  if (actionType === 'getMoviesByKeyword') {
    setTimeout(async function() {
      const content = await movie.getMovies({ query: text });

      return content.length > 0 &&
      actions.replyFlex(replyToken, content, 'We\'ll beam down immediately, Commodore. Kirk out.');
    }, 10000);
  };

  if (actionType === 'getMovies') {
    const content = await movie.getMovies();

    return actions.replyFlex(
      replyToken,
      content,
      'Scotty, I need warp speed in three minutes or we\'re all dead.'
    );
  }

  if (actionType === 'sendMap') {
    return actions.replyTemplate(replyToken, 'line://app/1571981096-OZoBNDWj');
  }

  // if (actionType === 'sendText') {
  //   return replyText(replyToken, 'Cover! Kirk to Enterprise, lock on transporters. Beam us up.');
  // };
};

// End point map
function broadcast (userIds, text) {
  console.log('Broadcast!');
  return client.multicast(
    [...userIds],
    [
      {
        type: 'text',
        text: text,
        quickReply: {
          items: [
            {
              type: 'action',
              imageUrl: 'https://example.com/sushi.png',
              action: {
                type: 'message',
                label: 'Sushi',
                text: 'Sushi',
              },
            },
            {
              type: 'action',
              imageUrl: 'https://example.com/tempura.png',
              action: {
                type: 'postback',
                label: 'View details',
                data: 'action=buy&itemid=111',
                text: 'Buy',
              },
            },
            {
              type: 'action',
              action: {
                type: 'location',
                label: 'Send location',
              },
            },
          ],
        },
      },
    ]
  );
};

function getUserProfile (userId) {
  client.getUserProfile(userId).then(profile => {
    console.log(profile);
  });
}

module.exports = {
  handleText,
  broadcast,
  getUserProfile,
};
