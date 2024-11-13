// api/giftcards.js

import axios from 'axios';

const shopifyConfig = {
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
  shopName: process.env.SHOPIFY_SHOP_NAME,
};

export default async function handler(req, res) {
  // 设置 CORS 头，允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const { customer_id } = req.query;

    if (!customer_id) {
      return res.status(400).json({ error: 'Missing customer_id parameter' });
    }

    const url = `https://${shopifyConfig.shopName}.myshopify.com/admin/api/2023-10/gift_cards.json?customer_id=${customer_id}`;

    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': shopifyConfig.accessToken,
        'Content-Type': 'application/json',
      },
    });

    const giftCards = response.data.gift_cards;

    // 获取每个礼品卡的详细信息，包括完整的礼品卡代码
    const detailedGiftCards = await Promise.all(
      giftCards.map(async (card) => {
        const cardUrl = `https://${shopifyConfig.shopName}.myshopify.com/admin/api/2023-10/gift_cards/${card.id}.json`;
        const cardResponse = await axios.get(cardUrl, {
          headers: {
            'X-Shopify-Access-Token': shopifyConfig.accessToken,
            'Content-Type': 'application/json',
          },
        });
        return cardResponse.data.gift_card;
      })
    );

    res.status(200).json(detailedGiftCards);
  } catch (error) {
    console.error('Error fetching gift cards:', error.message);
    // 打印完整的错误信息
    console.error(error);

    res.status(500).send('Server error');
  }
}
