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

const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await fetch("http://localhost:8000/api/v1/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, passwordConfirm }),
    });

    const data = await res.json();

    if (data.status === "success") {
      alert("signup is succesfull");
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

document.querySelector(".form--signup").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;

  signup(username, email, password, passwordConfirm);
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
