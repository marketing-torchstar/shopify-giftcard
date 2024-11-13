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

  // 获取查询参数中的 customer_id
  const { customer_id } = req.query;

  if (!customer_id) {
    return res.status(400).json({ error: 'Missing customer_id parameter' });
  }

  try {
    const url = `https://${shopifyConfig.shopName}.myshopify.com/admin/api/2023-10/gift_cards.json`;

    // 设置请求头，包含访问令牌
    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': shopifyConfig.accessToken,
        'Content-Type': 'application/json',
      },
    });

    // 过滤礼品卡，仅保留属于该客户的礼品卡
    const allGiftCards = response.data.gift_cards;
    const customerGiftCards = allGiftCards.filter(card => card.customer_id == customer_id);

    // 返回客户的礼品卡信息
    res.status(200).json(customerGiftCards);
  } catch (error) {
    console.error('Error fetching gift cards:', error.message);
    // 打印完整的错误信息
    console.error(error);

    res.status(500).send('Server error');
  }
}
