"use strict";

const Client = require("coinbase").Client;

class CreateAddressController {
  async index({ request, response }) {
    var apiKey =
      process.env[request.all().app.toUpperCase() + "_COINBASE_API_KEY"];
    var apiSecret =
      process.env[request.all().app.toUpperCase() + "_COINBASE_API_SECRET"];

    var client = new Client({ apiKey, apiSecret, strictSSL: false });

    return new Promise((resolve, reject) => {
      client.getAccount(request.all().walletId, function (err, account) {
        account.createAddress(
          {
            name: request.all().name,
          },
          function (err, address) {
            resolve(
              response.status(200).json({
                status: "success",
                message: address.address,
              })
            );
          }
        );
      });
    });
  }
}

module.exports = CreateAddressController;
