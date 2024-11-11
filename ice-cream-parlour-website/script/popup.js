window.onload = function () {
  document.getElementById("popup").style.display = "flex";
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

    const phone = document.getElementById("popup-email").value;
    if (phone) {
      try {
        const response = await fetch(
          `http://localhost:8080/create-cart?phone=${phone}`,
          {
            method: "POST",
          }
        );

        if (response.ok) {
          const data = await response.json();
          const cartId = data.data?.id;

          if (cartId) {
            alert(`Giỏ hàng đã được tạo thành công `);
            document.getElementById("popup").style.display = "none";
            sessionStorage.setItem("cartId", cartId);
          } else {
            alert(
              "Tạo giỏ hàng không thành công. Không nhận được ID giỏ hàng."
            );
          }
        } else {
          alert("Tạo giỏ hàng không thành công. Vui lòng thử lại.");
        }
      } catch (error) {
        console.error("Lỗi khi tạo giỏ hàng:", error);
        alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    }
  });

document
  .querySelector(".no-thanks")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("popup").style.display = "none";
  });
