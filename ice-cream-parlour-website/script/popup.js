window.onload = function () {
  if (!sessionStorage.getItem("cartId")) {
    document.getElementById("popup").style.display = "flex";
  }
};

document.querySelectorAll(".close-btn").forEach((button) => {
  button.addEventListener("click", function () {
    document.getElementById("popup").style.display = "none";
  });
});

document
  .getElementById("emailForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const phone = document.getElementById("popup-email").value.trim();

    try {
      const response = await fetch(
        `http://localhost:8080/create-cart?phone=${phone}`,
        { method: "POST" }
      );

      if (response.ok) {
        const data = await response.json();
        const cartId = data.data?.id;

        if (cartId) {
          sessionStorage.setItem("cartId", cartId);
          alert("Giỏ hàng đã được tạo thành công!");
          document.getElementById("popup").style.display = "none";
        } else {
          alert("Không thể tạo giỏ hàng. Thử lại sau!");
        }
      } else {
        alert("Yêu cầu tạo giỏ hàng thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo giỏ hàng:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  });

document
  .querySelector(".no-thanks")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/create-cart?phone=0`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const data = await response.json();
        const cartId = data.data?.id;

        if (cartId) {
          sessionStorage.setItem("cartId", cartId);
          alert("Giỏ hàng đã được tạo thành công!");
          document.getElementById("popup").style.display = "none";
        } else {
          alert("Không thể tạo giỏ hàng. Thử lại sau!");
        }
      } else {
        alert("Yêu cầu tạo giỏ hàng thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo giỏ hàng:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  });
