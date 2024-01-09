const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const { app } = require("./app");

async function main() {
  await mongoose.connect(process.env.DATABASE_STRING);
}

main()
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 3000, () => {
  console.log("We on some express juice");
});
