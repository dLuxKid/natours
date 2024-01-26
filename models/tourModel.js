const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxLength: [40, "A tour name must have less than 40 characters"],
      minLength: [10, "A tour name must have more than 10 characters"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either easy, medium or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be greater than 1"],
      max: [5, "Rating must not be greater than 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // only works when creating new documents not when updating
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount Price ({VALUE}) should be below regular price", // value is the same value as val in the validator function
      },
    },
    summary: {
      type: String,
      required: [true, "A tour must have a description"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON - to specify geospecific data
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }], // this dictates we are recieving User refrence id as values in this entity
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// indexing fields to improve performance 1 is ascending, -1 is descending
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
}); // they cannot be used in queries

// virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

// document middleware runs before the .save() and .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// embedding data in mongoose
// tourSchema.pre("save", async function (next) {
//   const guides = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guides);
//   next();
// });

// middleware runs after document has been saved or created
tourSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
});

// query middleware
// regex added to manipulate query that starts with find such as find, findOne, findById
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log("query took", Date.now() - this.start, "miliseconds");
  next();
});

// aggregation middleware
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
