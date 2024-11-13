require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Shopify API 凭证
const shopifyConfig = {
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_PASSWORD,
  shopName: process.env.SHOPIFY_SHOP_NAME,
};

app.get('/', async (req, res) => {
  try {
    const url = `https://${shopifyConfig.apiKey}:${shopifyConfig.password}@${shopifyConfig.shopName}.myshopify.com/admin/api/2023-10/gift_cards.json`;

    const response = await axios.get(url);
    const giftCards = response.data.gift_cards;

    res.json(giftCards);
  } catch (error) {
    console.error(error);
    res.status(500).send('服务器错误');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});