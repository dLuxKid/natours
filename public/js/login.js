const login = async (email, password) => {
  try {
    const res = await fetch("http://localhost:8000/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.status === "success") {
      alert("Logged in succesfully");
      window.location.href = "/";
    }
  } catch (error) {
    alert("Invalid email or password");
  }
};

document.querySelector(".form--login").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  login(email, password);
});

document
  .querySelector(".nav__el--logout")
  .addEventListener("click", async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/users/logout");

      const data = await res.json();

      if (data.status === "success") {
        alert("Logout successful");
        window.location.reload();
      }
    } catch (error) {
      alert(error.message);
    }
  });
