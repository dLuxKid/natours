const updateSettings = async (data, type) => {
  url =
    type === "data"
      ? "http://localhost:8000/api/v1/users/update-user"
      : "http://localhost:8000/api/v1/users/update-password";

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const data = await res.json();

    if (data.status === "success") alert("Updated details succesfully");
  } catch (error) {
    alert(error.message);
  }
};

document.querySelector(".form-user-data").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  updateSettings({ name, email }, "data");
});

document
  .querySelector(".form-user-settings")
  .addEventListener("submit", (e) => {
    e.preventDefault();

    const oldPassword = document.getElementById("password-current").value;
    const newPassword = document.getElementById("password").value;
    const newPasswordConfirm =
      document.getElementById("password-confirm").value;

    updateSettings(
      { oldPassword, newPassword, newPasswordConfirm },
      "password"
    );
  });
