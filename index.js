const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// 设置一个简单的路由
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});