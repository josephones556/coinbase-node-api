"use strict";

const Env = use("Env");
const Client = require("coinbase").Client;

class CreateTransactionController {
  async index({ request, response }) {
    var apiKey = Env.get(request.all().app.toUpperCase() + "_COINBASE_API_KEY");
    var apiSecret = Env.get(
      request.all().app.toUpperCase() + "_COINBASE_API_SECRET"
    );

    var client = new Client({ apiKey, apiSecret, strictSSL: false });

    return new Promise((resolve, reject) => {
      client.getAccount(request.all().walletId, function (err, account) {
        var args = {
          to: request.all().to,
          amount: request.all().amount,
          currency: request.all().currency,
          //description: "Sample transaction for you",
        };
        account.sendMoney(args, function (err, txn) {
          if (txn) {
            resolve(
              response.status(200).json({
                status: "success",
                message: txn.network.hash ? txn.network.hash : txn.id,
              })
            );
          }

          if (err) {
            resolve(
              response.status(400).json({
                status: "failed",
                message: err.message,
              })
            );
          }
        });
      });
    });
  }
}

module.exports = CreateTransactionController;
