"use strict";

const { validate } = use("Validator");

const Client = require("coinbase").Client;
const collect = require("collect.js");

class AccountController {
  async index({ request, response }) {
    const rules = {
      app: "required|string",
    };
    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.status(400).json(validation.messages()[0]);
    }
    //
    var apiKey =
      process.env[request.all().app.toUpperCase() + "_COINBASE_API_KEY"];
    var apiSecret =
      process.env[request.all().app.toUpperCase() + "_COINBASE_API_SECRET"];

    var client = new Client({ apiKey, apiSecret, strictSSL: false });

    return new Promise((resolve, reject) => {
      client.getAccounts({}, function (err, accs) {
        return resolve(
          response.status(200).json({
            status: "success",
            message: accs,
          })
        );
      });
    });
  }
}

module.exports = AccountController;
