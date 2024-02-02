const stripe = Stripe(process.env.public_secret_key);

const bookTour = async (tourId) => {
  try {
    const res = await fetch(
      `http://localhost:8000/api/v1/booking/checkout-session/${tourId}`
    );

    const data = await res.json();

    if (data.status === "success") {
      await stripe.redirectToCheckout({
        sessionId: data.session.id,
      });
    }
  } catch (error) {
    alert("Error, something went wrong");
  }
};

const bookedTour = document.getElementById("book-tour");

bookedTour.addEventListener("click", async () => {
  bookedTour.textContent = "Processing...";
  const bookedTourId = bookedTour.getAttribute("data-tourId");

  await bookTour(bookedTourId);
});
