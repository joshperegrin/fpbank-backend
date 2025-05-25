const { withinTransactionLimit } = require("../lib/transactionLimit.js")
function isLateNight() {
  const now = new Date();
  const hour = now.getHours(); // 0–23

  // Return true if time is between 11PM (23) and 6AM (6)
  return hour >= 23 || hour < 6;
}

function ruleBasedAccessControlMiddleware(req, res, next){
  if(isLateNight()){
    return res.status(500).json({ message: "Transaction is not within banking hours"})
  }

  if(req.route.path === '/external' && !withinTransactionLimit(req.user_id)){
    return res.status(500).json({ message: "Exceeded Transaction Limit"})
  }
  next()
}

module.exports = {
  ruleBasedAccessControlMiddleware
}
