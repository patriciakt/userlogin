document.addEventListener("DOMContentLoaded", function () {
  fetchUserDataAndUpdateFields();
});

document
  .getElementById("userInfoForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    axios
      .post("/updateUserInfo", formData)
      .then((response) => response.data)
      .then((data) => {
        updateInputFields(data.userInfo);
      })
      .catch((error) => console.error("error:", error));
  });

function fetchUserDataAndUpdateFields() {
  axios
    .get("/getUserData")
    .then((response) => response.data)
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

document
  .getElementById("deleteForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const postId = this.dataset.postId;
    axios
      .post(`/delete-post/${postId}`)
      .then((response) => response.data)
      .then((data) => {
        console.log("post deleted:", data);
        window.location.href = "/userPage";
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  });
