if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
