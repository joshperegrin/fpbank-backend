const { getListOfBillers, getListOfEWallets } = require("../models/transaction.model.js")

function getListOfBillersController(req, res){
  let billers;
  try {
    billers = getListOfBillers()
  } catch(e){
    return res.status(500).json({ e })
  }

  if(billers.length < 1){
    return res.status(404).json({ message: "No Billers Found" })
  }

  return res.status(200).json({ billers: billers.map((value) => value.name ) })
}

function getListOfEWalletsController(req, res){
  let ewallets;
  try {
    ewallets = getListOfEWallets()
  } catch(e){
    return res.status(500).json({ e })
  }

  if(ewallets.length < 1){
    return res.status(404).json({ message: "No EWallets Found" })
  }

  return res.status(200).json({ ewallets: ewallets.map((value) => value.name ) })
}


module.exports = {
  getListOfBillersController,
  getListOfEWalletsController
}
