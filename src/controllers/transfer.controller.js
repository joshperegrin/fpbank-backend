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

function externalTransferController(req, res){

  const srcAcc = getAccountByUserID(req.user_id)
  let serviceCharge;
  if(req.body.transferChannel === 'INSTAPAY'){
    serviceCharge = 15;
  } else {
    serviceCharge = 0;
  }

  // sender account exist and is valid
  if(typeof srcAcc === "undefined"){
    return res.status(500).json({ message: "Can't find Source Account" })
  }

  const srcName = getName(srcAcc.user_id)
  const destName = req.body.recipient_AccountName

  // check if bank exist

  if(!getListOfBanks().map((value) => value.name ).includes(req.body.recipient_Bank)){
    return res.status(500).json({ message: "Transfer to " + req.body.recipient_Bank + " is not supported." })
  }

  
  // sender has sufficient funds
  if(srcAcc.balance < parseFloat(req.body.amount) + serviceCharge){
    return res.status(400).json({ message: "Insufficient balance."})
  }

  const currentDate = new Date()
  const transactionName = "Fund Transfer to " + destName
  const transactionReferenceNumber = "EXT" + currentDate.toISOString().slice(0, 10).replace(/-/g, '') + generateRandomReferenceNumber();
  // enforce transfer limits
  const transaction = {
    transaction_reference_number: transactionReferenceNumber,
    transaction_name: transactionName,
    transaction_status: "COMPLETED",
    transaction_type: "EXTERNAL_TRANSFER",
    amount: req.body.amount,
    note: req.body.note,
    transaction_details: JSON.stringify({
      source_Name: srcName,
      source_AccountNumber: srcAcc.account_number,
      destination_Bank: req.body.recipient_Bank,
      destination_Name: req.body.recipient_AccountName,
      destination_AccountNumber: req.body.recipient_AccountNumber,
      transferChannel: req.body.transferChannel,
      serviceCharge
    }),
  }
  
  // insert new transaction
  const transaction_id = createTransaction(transaction)

  // insert transactionentries
  createTransactionEntry(srcAcc.account_id, transaction_id, "DEBIT")

  // adjust balance for the bank account
  debitAccount(parseFloat(req.body.amount) + serviceCharge, srcAcc.account_id)

  return res.status(201).json({
    transactionDate: currentDate.toISOString(),
    transactionName,
    transactionReferenceNumber,
    transactionStatus: "COMPLETED",
    serviceCharge,
  })
  
}

function billerTransferController(req, res){
  const srcAcc = getAccountByUserID(req.user_id)
  
  // sender account exist and is valid
  if(typeof srcAcc === "undefined"){
    return res.status(400).json({ message: "Can't find Source Account" })
  }

  const srcName = getName(srcAcc.user_id)

  if(!getListOfBillers().map((value) => value.name ).includes(req.body.billerName)){
    return res.status(400).json({ message: "Payment to " + req.body.billerName + " is not supported." })
  }

  // sender has sufficient funds
  if(srcAcc.balance < parseFloat(req.body.amount)){
    return res.status(400).json({ message: "Insufficient balance."})
  }

  const currentDate = new Date()
  const transactionName = req.body.billerName + " Bills Payment"
  const transactionReferenceNumber = "BLS" + currentDate.toISOString().slice(0, 10).replace(/-/g, '') + generateRandomReferenceNumber();
  // enforce transfer limits
  const transaction = {
    transaction_reference_number: transactionReferenceNumber,
    transaction_name: transactionName,
    transaction_status: "COMPLETED",
    transaction_type: "BILL_PAYMENT",
    amount: req.body.amount,
    note: req.body.note,
    transaction_details: JSON.stringify({
      source_Name: srcName,
      source_AccountNumber: srcAcc.account_number,
      biller_Name: req.body.billerName,
      biller_referenceNumber: req.body.referenceNumber,
    }),
  }
  
  // insert new transaction
  const transaction_id = createTransaction(transaction)

  // insert two transactionentries (debit, credit)
  createTransactionEntry(srcAcc.account_id, transaction_id, "DEBIT")

  // adjust balance for the two bank accounts
  debitAccount(parseFloat(req.body.amount), srcAcc.account_id)

  return res.status(201).json({
    transactionDate: currentDate.toISOString(),
    transactionName,
    transactionReferenceNumber,
    transactionStatus: "COMPLETED",
  })
}

function ewalletTransferController(req, res){
  const srcAcc = getAccountByUserID(req.user_id)
  
  // sender account exist and is valid
  if(typeof srcAcc === "undefined"){
    return res.status(400).json({ message: "Can't find Source Account" })
  }

  const srcName = getName(srcAcc.user_id)

  if(!getListOfEWallets().map((value) => value.name ).includes(req.body.ewalletName)){
    return res.status(400).json({ message: "Payment to " + req.body.ewalletName+ " is not supported." })
  }

  // sender has sufficient funds
  if(srcAcc.balance < parseFloat(req.body.amount)){
    return res.status(400).json({ message: "Insufficient balance."})
  }

  const currentDate = new Date()
  const transactionName = req.body.ewalletName + " Load Transfer"
  const transactionReferenceNumber = "EWL" + currentDate.toISOString().slice(0, 10).replace(/-/g, '') + generateRandomReferenceNumber();
  // enforce transfer limits
  const transaction = {
    transaction_reference_number: transactionReferenceNumber,
    transaction_name: transactionName,
    transaction_status: "COMPLETED",
    transaction_type: "EWALLET_LOAD",
    amount: req.body.amount,
    note: "",
    transaction_details: JSON.stringify({
      source_Name: srcName,
      source_AccountNumber: srcAcc.account_number,
      ewallet_Name: req.body.ewalletName,
      ewallet_referenceNumber: req.body.referenceNumber,
    }),
  }
  
  // insert new transaction
  const transaction_id = createTransaction(transaction)

  // insert two transactionentries (debit, credit)
  createTransactionEntry(srcAcc.account_id, transaction_id, "DEBIT")

  // adjust balance for the two bank accounts
  debitAccount(parseFloat(req.body.amount), srcAcc.account_id)

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
  internalTransferController,
  externalTransferController,
  billerTransferController,
  ewalletTransferController
}
