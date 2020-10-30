"use strict";

const { validate } = use("Validator");

const Client = require("coinbase").Client;

class CreateAddressController {
  async index({ request, response }) {
    const rules = {
      app: "required|string",
      walletId: "required|string",
      name: "required|string",
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
