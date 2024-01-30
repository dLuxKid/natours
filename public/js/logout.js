document
  .querySelector(".nav__el--logout")
  .addEventListener("click", async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/users/logout");

      const data = await res.json();

      if (data.status === "success") {
        alert("Logout successful");
        window.location.href = "/";
      }
    } catch (error) {
      alert(error.message);
    }
  });
