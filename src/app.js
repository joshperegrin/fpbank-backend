const express = require("express");
const cors = require('cors')
const authRoutes = require("./routes/auth.routes.js")
const accountRoutes = require("./routes/account.routes.js")
const transferRoutes = require("./routes/transfer.routes.js")
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT;

app.use(cors())
app.use('/auth', authRoutes)
app.use('/account', accountRoutes)
app.use('/transfer', transferRoutes)


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
