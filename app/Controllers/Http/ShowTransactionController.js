"use strict";
const { validate } = use("Validator");

const Client = require("coinbase").Client;

class ShowTransactionController {
  async index({ request, response }) {
    const rules = {
      app: "required|string",
      walletId: "required|string",
      transactionId: "required|string",
    };
    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.status(400).json(validation.messages()[0]);
    }

    var apiKey =
      process.env[request.all().app.toUpperCase() + "_COINBASE_API_KEY"];
    var apiSecret =
      process.env[request.all().app.toUpperCase() + "_COINBASE_API_SECRET"];

    var client = new Client({ apiKey, apiSecret, strictSSL: false });

    return new Promise((resolve, reject) => {
      client.getAccount(request.all().walletId, function (err, account) {
        account.getTransaction(request.all().transactionId, function (err, tx) {
          resolve(
            response.status(200).json({
              status: "success",
              message: {
                id: tx.id,
                status: tx.status,
                amount: tx.amount,
                network: tx.network,
                confirmations: tx.confirmations,
              },
            })
          );
        });
      });
    });
  }
}

module.exports = ShowTransactionController;
