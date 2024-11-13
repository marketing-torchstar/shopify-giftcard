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

  const { customer_id } = req.query;

  if (!customer_id) {
    return res.status(400).json({ error: 'Missing customer_id parameter' });
  }

  try {
    let customerGiftCards = [];
    let pageInfo = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const url = `https://${shopifyConfig.shopName}.myshopify.com/admin/api/2023-10/gift_cards.json`;

      const params = {
        limit: 50,
      };

      if (pageInfo) {
        params.page_info = pageInfo;
      }

      const response = await axios.get(url, {
        headers: {
          'X-Shopify-Access-Token': shopifyConfig.accessToken,
          'Content-Type': 'application/json',
        },
        params: params,
      });

      const allGiftCards = response.data.gift_cards;

      // 过滤属于客户的礼品卡
      const filteredCards = allGiftCards.filter(card => card.customer_id == customer_id);
      customerGiftCards = customerGiftCards.concat(filteredCards);

      // 检查是否有下一页
      const linkHeader = response.headers.link;
      if (linkHeader && linkHeader.includes('rel="next"')) {
        // 提取 page_info
        const matches = linkHeader.match(/<[^>]+[?&]page_info=([^&>]+)[^>]*>; rel="next"/);
        if (matches && matches[1]) {
          pageInfo = matches[1];
        } else {
          hasNextPage = false;
        }
      } else {
        hasNextPage = false;
      }
    }

    res.status(200).json(customerGiftCards);
  } catch (error) {
    console.error('Error fetching gift cards:', error.message);
    console.error(error);
    res.status(500).send('Server error');
  }
}
