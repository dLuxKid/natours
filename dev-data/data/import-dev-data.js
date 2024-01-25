const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const Tour = require("../../models/tourModel");
const User = require("../../models/userModel");
const Review = require("../../models/reviewModel");

const allTours = fs.readFileSync(`${__dirname}/tours.json`, "utf-8");
const allUsers = fs.readFileSync(`${__dirname}/users.json`, "utf-8");
const allReviews = fs.readFileSync(`${__dirname}/reviews.json`, "utf-8");

async function main() {
  await mongoose.connect(process.env.DATABASE_STRING);
}

main()
  .then(() => console.log("successful"))
  .catch((err) => console.log(err));

const importData = async () => {
  try {
    await Promise.all([
      Tour.create(JSON.parse(allTours)),
      User.create(JSON.parse(allUsers)),
      Review.create(JSON.parse(allReviews)),
    ]);
    console.log("Data successfully loaded");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Promise.all([
      Tour.deleteMany(),
      User.deleteMany(),
      Review.deleteMany(),
    ]);
    console.log("Data successfully deleted");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
