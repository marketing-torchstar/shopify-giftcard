// api/giftcards.js

import axios from 'axios';

const shopifyConfig = {
  accessToken: process.env.SHOPIFY_PASSWORD, // 使用访问令牌进行认证
  shopName: process.env.SHOPIFY_SHOP_NAME,
};

export default async function handler(req, res) {
  // 设置 CORS 头，允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const url = `https://${shopifyConfig.shopName}.myshopify.com/admin/api/2023-10/gift_cards.json`;

    // 设置请求头，包含访问令牌
    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': shopifyConfig.accessToken,
        'Content-Type': 'application/json',
      },
    });

    const giftCards = response.data.gift_cards;

    res.status(200).json(giftCards);
  } catch (error) {
    console.error('Error fetching gift cards:', error.message);
    // 打印完整的错误信息
    console.error(error);

    res.status(500).send('服务器错误');
  }
}
