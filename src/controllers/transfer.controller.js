const { getListOfBillers, getListOfEWallets, getListOfBanks, createTransaction, createTransactionEntry, debitAccount, creditAccount } = require("../models/transaction.model.js")
const { getAccountByUserID, getAccountByAccountNumber } = require("../models/account.model.js")
const { generateRandomReferenceNumber } = require("../lib/randomGenerator.js")
const { getName } = require("../models/user.model.js")

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

function getListOfBanksController(req, res){
  let banks;
  try {
    banks = getListOfBanks()
  } catch(e){
    return res.status(500).json({ e })
  }

  if(banks.length < 1){
    return res.status(404).json({ message: "No Banks Found" })
  }

  return res.status(200).json({ banks: banks.map((value) => value.name ) })
}

function internalTransferController(req, res){
  const destAcc = getAccountByAccountNumber(req.body.destination_AccountNumber)
  const srcAcc = getAccountByUserID(req.user_id)
  
  // sender account exist and is valid
  if(typeof srcAcc === "undefined"){
    return res.status(500).json({ message: "Can't find Source Account" })
  }

  console.log(srcAcc)
  console.log(destAcc)
  const srcName = getName(srcAcc.user_id)
  const destName = getName(destAcc.user_id)

  // destination account exist and is valid
  if(typeof destAcc === "undefined"){
    return res.status(404).json({ message: "Destination Account doesn't exist" })
  }

  // sender account != to destination account
  if(destAcc.account_number === srcAcc.account_number){
    return res.status(400).json({ message: "Can't transfer to own account" })
  }
  // sender has sufficient funds
  if(srcAcc.balance < req.body.amount){
    return res.status(400).json({ message: "Insufficient balance."})
  }
  const currentDate = new Date()
  const transactionName = "Fund Transfer to " + destName.firstname + destName.lastname;
  const transactionReferenceNumber = "FP" + currentDate.toISOString().slice(0, 10).replace(/-/g, '') + generateRandomReferenceNumber();
  // enforce transfer limits
  const transaction = {
    transaction_reference_number: transactionReferenceNumber,
    transaction_name: transactionName,
    transaction_status: "COMPLETED",
    transaction_type: "INTERNAL_TRANSFER",
    amount: req.body.amount,
    note: req.body.note,
    transaction_details: JSON.stringify({
      source_Name: srcName,
      source_AccountNumber: srcAcc.account_number,
      destination_Name: destName,
      destination_AccountNumber: destAcc.account_number,
    }),
  }
  
  // insert new transaction
  const transaction_id = createTransaction(transaction)

  // insert two transactionentries (debit, credit)
  createTransactionEntry(srcAcc.account_id, transaction_id, "DEBIT")
  createTransactionEntry(destAcc.account_id, transaction_id, "CREDIT")

  // adjust balance for the two bank accounts
  debitAccount(req.body.amount, srcAcc.account_id)
  creditAccount(req.body.amount, destAcc.account_id)

  return res.status(201).json({
    transactionDate: currentDate.toISOString(),
    transactionName,
    transactionReferenceNumber,
    transactionStatus: "COMPLETED",
  })
}

module.exports = {
  getListOfBillersController,
  getListOfEWalletsController,
  getListOfBanksController,
  internalTransferController
}
