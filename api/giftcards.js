// api/giftcards.js

import axios from 'axios';

const shopifyConfig = {
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
  shopName: process.env.SHOPIFY_SHOP_NAME,
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const { customer_id } = req.query;

    if (!customer_id) {
      return res.status(400).json({ error: 'Missing customer_id parameter' });
    }

    const url = `https://${shopifyConfig.shopName}.myshopify.com/admin/api/2023-10/graphql.json`;

    const query = `
      {
        giftCards(first: 100) {
          edges {
            node {
              id
              displayCode
              initialValue
              balance
              currencyCode
              disabledAt
              createdAt
              expiresOn
              customer {
                id
              }
            }
          }
        }
      }
    `;

    const response = await axios.post(
      url,
      { query },
      {
        headers: {
          'X-Shopify-Access-Token': shopifyConfig.accessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.errors) {
      console.error('GraphQL errors:', response.data.errors);
      return res.status(500).json({ error: 'Error fetching gift cards' });
    }

    const allGiftCards = response.data.data.giftCards.edges.map(edge => edge.node);

    // 过滤属于当前客户的礼品卡
    const customerGid = `gid://shopify/Customer/${customer_id}`;
    const giftCards = allGiftCards.filter(card => card.customer && card.customer.id === customerGid);

    res.status(200).json(giftCards);
  } catch (error) {
    console.error('Error fetching gift cards:', error.message);
    console.error(error);

    res.status(500).send('Server error');
  }
}
