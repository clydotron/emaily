const express = require('express'); //use this sytnax within node
const app = express();

app.get('/', (req,res) => {
  res.send({ hi: 'snork!' })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
