const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const Tour = require("../../models/tourModel");

const allTours = fs.readFileSync(`${__dirname}/tours.json`, "utf-8");

async function main() {
  await mongoose.connect(process.env.DATABASE_STRING);
}

main()
  .then(() => console.log("successful"))
  .catch((err) => console.log(err));

const importData = async () => {
  try {
    await Tour.create(JSON.parse(allTours));
    console.log("Data successfully loaded");
    process.exit();
  } catch (error) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted");
    process.exit();
  } catch (error) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
