if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const fs = require('fs');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

const stripe = require('stripe')(stripeSecretKey);

const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));

app.get('/store', (req, res) => {
  fs.readFile('items.json', (error, data) => {
    if (error) {
      res.status(500).end();
    } else {
      res.render('store.ejs', {
        stripePublishableKey: stripePublishableKey,
        items: JSON.parse(data),
      });
    }
  });
});

app.post('/purchase', (req, res) => {
  fs.readFile('items.json', (error, data) => {
    if (error) {
      res.status(500).end();
    } else {
      const itemsJson = JSON.parse(data);
      const itemsArray = itemsJson.music.concat(itemsJson.merch);
      let total = 0;
      req.body.items.forEach((item) => {
        const itemJson = itemsArray.find((i) => {
          return i.id == item.id;
        });
        total += itemJson.price * item.quantity;
      });

      stripe.charges
        .create({
          amount: total,
          source: req.body.stripeTokenId,
          currency: 'usd',
        })
        .then(() => {
          console.log('Charge successful');
          res.json({ message: 'Successfully purchased items ' });
        })
        .catch(() => {
          console.log('Charge failed');
          res.status(500).end();
        });
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
