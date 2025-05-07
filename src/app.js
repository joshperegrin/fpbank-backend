const express = require("express");
const authRoutes = require("./routes/auth.routes.js")
const accountRoutes = require("./routes/account.routes.js")

const app = express();
const PORT = process.env.PORT;

app.use('/auth', authRoutes)
app.use('/account', accountRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
