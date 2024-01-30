const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log(err.name + ", " + err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

async function main() {
  await mongoose.connect(process.env.DATABASE_STRING);
}

main().then(() => console.log("connected to database"));

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("We on some express juice");
});

process.on("unhandledRejection", (err) => {
  console.log(err.name + ", " + err.message);
  server.close(() => {
    process.exit(1);
  });
});
