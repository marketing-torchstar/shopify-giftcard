// api/giftcards.js

import axios from 'axios';

// Shopify API 凭证
const shopifyConfig = {
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_PASSWORD,
  shopName: process.env.SHOPIFY_SHOP_NAME,
};

export default async function handler(req, res) {
  // 设置 CORS 头，允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const url = `https://${shopifyConfig.apiKey}:${shopifyConfig.password}@${shopifyConfig.shopName}.myshopify.com/admin/api/2023-10/gift_cards.json`;

    const response = await axios.get(url);
    const giftCards = response.data.gift_cards;

    res.status(200).json(giftCards);
  } catch (error) {
    console.error(error);
    res.status(500).send('服务器错误');
  }
}