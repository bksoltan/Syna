const express = require("express");
const ipfilter = require("express-ipfilter").IpFilter;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const process = require("process");
const mongoose = require("mongoose");
const { errorHandler } = require("./middleware/error-handler");
const { ethers } = require("ethers");

require("dotenv").config();

const { MONGO_URI, PRIVATE_KEY, SERVER_PORT } = process.env;

async function main() {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.info("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }

  const app = express();

  // Allow the following IPs
  // TODO: add ip address of WP end
  const ips = ["::ffff:127.0.0.1", "::1", "::ffff:192.168.116.82"];
  app.use(ipfilter(ips, { mode: "allow" }));

  // Add headers before the routes are defined
  app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

    // Request methods you wish to allow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
  });

  // Init Middleware
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  // app.use(cookieParser());

  // Define Routes
  app.use("/api", require("./routes/api"));

  app.use(errorHandler);

  app.listen(SERVER_PORT, () =>
    console.info(`Server started on port ${SERVER_PORT}`)
  );
}

function test() {
  const b1 = Buffer.from(
    "0x96Ba44CfDF6AbC08faea1c185dAD28785cD83A3a".substring(2),
    "hex"
  );
  console.log(b1);
  const momId = 123;
  const dadId = 456;

  console.log(momId.toString(16));
  const b2 = Buffer.from(momId.toString(16), "hex");
  const b3 = Buffer.from(dadId.toString(16), "hex");
  console.log(b2);
  console.log(b3);

  const b4 = Buffer.from(
    ethers.utils.parseEther("221546.23645").toBigInt().toString(16)
  );
  console.log(b4);

  const all = Buffer.concat([b1, b2, b3, b4]);
  console.log(all);
}

// test();
main();
