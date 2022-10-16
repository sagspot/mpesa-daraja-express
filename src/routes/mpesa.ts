import axios from "axios";
import express from "express";
import { dateTime } from "../lib/date";
const router = express.Router();

const CONSUMER_KEY = "yourconsumerkey";
const CONSUMER_SECRET = "yourconsumersecret";
const BUSINESS_SHORT_CODE = 174379;
const PASS_KEY =
  "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
const TRANSACTION_TYPE = "CustomerPayBillOnline";
const CALLBACK_URL = "https://2e99-62-8-87-70.au.ngrok.io/api/cb";
const ACCOUNT_REFERENCE = "CompanyXYZ";
const TOKEN_URL =
  "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
const STK_URL =
  "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

async function getToken() {
  try {
    const token = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
    const nodeToken =
      "cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ==";

    const { data } = await axios.get(TOKEN_URL, {
      headers: { Authorization: `Basic ${nodeToken}` },
    });

    console.log("data: ", data);

    return data.access_token;
  } catch (error) {
    throw error;
  }
}

router.post("/stk", async (req, res) => {
  let missingFields: string[] = [];

  if (!req.query.tel) missingFields.push("tel");
  if (!req.query.amt) missingFields.push("amt");

  if (missingFields.length > 0)
    return res
      .status(400)
      .json({ message: `Missing fields; ${missingFields.join(", ")}` });

  try {
    const data = {
      BusinessShortCode: BUSINESS_SHORT_CODE,
      Password: btoa(`${BUSINESS_SHORT_CODE}${PASS_KEY}${dateTime()}`),
      Timestamp: dateTime(),
      TransactionType: TRANSACTION_TYPE,
      Amount: req.query.amt,
      PartyA: req.query.tel,
      PartyB: BUSINESS_SHORT_CODE,
      PhoneNumber: req.query.tel,
      CallBackURL: CALLBACK_URL,
      AccountReference: ACCOUNT_REFERENCE,
      TransactionDesc: "Payment of services",
    };

    const { data: response } = await axios.post(STK_URL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
    });

    res.status(200).json({ success: response });
  } catch (error) {
    res.status(500).json({ fail: error });
  }
});

router.post("/cb", (req, res) => {
  try {
    console.log("response: ", JSON.stringify(req.body.Body, null, 2));
    res.status(200).json({ success: "ok" });
  } catch (error) {
    res.status(500).json({ fail: error });
  }
});

export default router;
