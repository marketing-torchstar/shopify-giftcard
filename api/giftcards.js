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
    const { customer_email } = req.query;

    if (!customer_email) {
      return res.status(400).json({ error: 'Missing customer_email parameter' });
    }

    const url = `https://${shopifyConfig.shopName}.myshopify.com/admin/api/2023-10/graphql.json`;

    const query = `
      {
        giftCards(first: 10, query: "customer_email:${customer_email}") {
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
            }
          }
        }
      }
    `;

    const response = await axios.post(url, { query }, {
      headers: {
        'X-Shopify-Access-Token': shopifyConfig.accessToken,
        'Content-Type': 'application/json',
      },
    });

    const giftCards = response.data.data.giftCards.edges.map(edge => edge.node);

    res.status(200).json(giftCards);
  } catch (error) {
    console.error('Error fetching gift cards:', error.message);
    console.error(error);

    res.status(500).send('Server error');
  }
}
