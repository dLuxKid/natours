const stripe = require("stripe")(process.env.stripe_secret_key);
const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsyncErr");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) return next(new AppError("This tour does not exist", 404));

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${tour.name} Tour`,
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}?success=true`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${
      tour.slug
    }?canceled=true`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
  });

  res.status(200).json({
    status: "success",
    session,
  });
});
