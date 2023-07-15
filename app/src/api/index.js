const express = require("express");
const crypto = require("crypto");
const router = express.Router();

router.get("/ping", (req, res) => {
  res.send({
    result: "pong",
  });
});

const transactions = {};
const accounts = {};

router.post("/transactions", validateRequest, (req, res) => {
  const { account_id, amount } = req.body;
  const transactionId = crypto.randomUUID();
  const createdAt = new Date(Date.now()).toISOString();

  transactions[transactionId] = {
    account_id,
    amount,
    transactionId,
    createdAt,
  };

  if (accounts[account_id] !== undefined) {
    accounts[account_id] += Number(amount);
  } else {
    accounts[account_id] = Number(amount);
  }

  res.status(201).json({ account_id, amount, transactionId, createdAt });
});

router.get("/transactions", (req, res) => {
  res.json(Object.values(transactions).reverse());
});

router.get("/transactions/:transactionId", (req, res) => {
  if (
    req.params.transactionId === undefined ||
    req.params.transactionId.length != 36
  ) {
    return res
      .status(400)
      .json({ message: "transaction_id missing or has incorrect type." });
  }

  if (transactions[req.params.transactionId]) {
    res.json(transactions[req.params.transactionId]);
  } else {
    res.status(404).json({ message: "Transaction not found" });
  }
});

router.get("/accounts/:accountId", (req, res) => {
  if (req.params.accountId === undefined || req.params.accountId.length != 36) {
    return res
      .status(400)
      .json({ message: "account_id missing or has incorrect type." });
  }

  if (accounts[req.params.accountId]) {
    res.json({
      account_id: req.params.accountId,
      balance: accounts[req.params.accountId],
    });
  } else {
    res.status(404).json({ message: "Account not found" });
  }
});

module.exports = router;

function validateRequest(req, res, next) {
  console.log(Number(req.body.amount));
  if (
    Number(req.body.amount).toString() == "NaN" ||
    req.body.account_id === undefined ||
    req.body.amount === undefined
  ) {
    return res.status(400).json({
      message: "Mandatory body parameters missing or have incorrect type.",
    });
  }

  if (req.method != "POST" && req.method != "GET") {
    return res
      .status(405)
      .json({ message: "Specified HTTP method not allowed." });
  }

  if (req.body.account_id.length != 36) {
    return res
      .status(415)
      .json({ message: "Specified content type not allowed." });
  }

  next();
}
