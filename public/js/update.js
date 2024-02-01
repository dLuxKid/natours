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

    const result = await res.json();

    if (result.status === "success") alert("Updated details succesfully");
  } catch (error) {
    alert(error.message);
  }
};

document.querySelector(".form-user-data").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const photo = document.getElementById("photo").files[0];

  updateSettings({ name, email, photo }, "data");
});

document
  .querySelector(".form-user-settings")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Loading...";

    const oldPassword = document.getElementById("password-current").value;
    const newPassword = document.getElementById("password").value;
    const newPasswordConfirm =
      document.getElementById("password-confirm").value;

    await updateSettings(
      { oldPassword, newPassword, newPasswordConfirm },
      "password"
    );

    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
    document.querySelector(".btn--save-password").textContent = "Save Password";
  });
