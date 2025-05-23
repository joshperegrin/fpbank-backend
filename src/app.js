const express = require("express");
const cors = require('cors')
const authRoutes = require("./routes/auth.routes.js")
const accountRoutes = require("./routes/account.routes.js")
const transferRoutes = require("./routes/transfer.routes.js")

const app = express();
const PORT = process.env.PORT;

app.use('/auth', authRoutes)
app.use('/account', accountRoutes)
app.use('/transfer', transferRoutes)

app.use(cors({
  origin: 'http://localhost:8100'
}))

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
