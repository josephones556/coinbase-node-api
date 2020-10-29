"use strict";

const Client = require("coinbase").Client;

class ShowTransactionController {
  async index({ request, response }) {
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
