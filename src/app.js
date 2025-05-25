require('dotenv').config();
const express = require("express");
const cors = require('cors')
const authRoutes = require("./routes/auth.routes.js")
const accountRoutes = require("./routes/account.routes.js")
const transferRoutes = require("./routes/transfer.routes.js")
const cryptoRoutes = require("./routes/crypto.routes.js")
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Add middleware to parse JSON request bodies
app.use(express.json());

app.use(cors())
app.use('/auth', authRoutes)
app.use('/account', accountRoutes)
app.use('/transfer', transferRoutes)
app.use('/crypto', cryptoRoutes)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
