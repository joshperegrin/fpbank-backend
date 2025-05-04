const express = require("express");
const authRoutes = require("./routes/auth.routes")

const app = express();
const PORT = process.env.PORT;

app.use('/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
