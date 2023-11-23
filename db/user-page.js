document.addEventListener("DOMContentLoaded", function () {
  fetchUserDataAndUpdateFields();
});

document
  .getElementById("userInfoForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch("/updateUserInfo", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        updateInputFields(data.userInfo);
      })
      .catch((error) => console.error("error:", error));
  });

function fetchUserDataAndUpdateFields() {
  fetch("/getUserData")
    .then((response) => response.json())
    .then((data) => {
      updateInputFields(data.userInfo);
    })
    .catch((error) => console.error("error:", error));
}

function updateInputFields(userInfo) {
  document.getElementById("returnedCityInput").value = userInfo.returnedCity;
  document.getElementById("returnedCityInput2").value = userInfo.returnedCity2;
  document.getElementById("returnedCityInput3").value = userInfo.returnedCity3;
}
