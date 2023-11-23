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

///for delete button
document
  .getElementById("deleteForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const postId = this.dataset.postId;
    fetch(`/delete-post/${postId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("post deleted:", data);
        window.location.href = "/userPage";
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  });
