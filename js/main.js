import { Cart } from "./cart.js";
import { productsData } from "./data.js";

const productContainer = document.getElementsByClassName("products");

const logout = document.getElementById("logout");
const notification = document.getElementById("notification");

const openSidebarBtn = document.querySelector(".open-sidebar-btn");
const closeSidebarBtn = document.querySelector("#close-sidebar-btn");

export const openSidebar = openSidebarBtn.addEventListener("click", () => {
  document.querySelector(".sidebar").classList.remove("hidden");
});

export const closeSidebar = closeSidebarBtn.addEventListener("click", () => {
  document.querySelector(".sidebar").classList.add("hidden");
});



export const showNotification = (message, type = "success") => {
  notification.textContent = message;
  notification.className = `p-3 rounded-lg text-white mb-4 ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  }  fixed top-10 left-[50%] -translate-x-1/2 w-full max-w-[500px] mx-auto text-center`;
  notification.classList.remove("hidden");

  setTimeout(() => {
    notification.classList.add("hidden");
  }, 3000);
};


export const displayUsername = () => {
    const usernameElements = document.querySelectorAll(".username");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    usernameElements.forEach((element) => {
      element.innerHTML = `Welcome, ${currentUser.name}!`;
    });
  }
};



class Products {
  constructor(products) {
    this.products = products;
  }

  showData = () => {
    productContainer[0].innerHTML = "";
    this.products.forEach((product) => {
      const productItem = document.createElement("div");
      productItem.classList.add(
        "flex",
        "flex-col",
        "items-center",
        "justify-between",
        "gap-3"
      );
      productItem.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.title}" class="w-full h-[250px]">
        </div>
        <div class="flex flex-col items-start gap-1">
          <h2 class="text-black font-semibold hover:text-[#2b38d1]">${product.title}</h2>
          <p class="line-clamp-2 text-sm text-slate-700">${product.description}</p>
          <p class="text-sm text-[#2b38d1] font-semibold">$${product.price}</p>
          <button class="w-full rounded-md bg-[#2b38d1] text-white border-0 text-sm py-2 hover:bg-black add-cart" data-id=${product.id}>Add to Cart</button>
        </div>
      `;
      productContainer[0].appendChild(productItem);
    });

    this.addEventListeners();
  };

  addEventListeners = () => {
    const addToCartBtns = document.getElementsByClassName("add-cart");
    Array.from(addToCartBtns).forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const target = e.target;
        const productId = target.getAttribute("data-id");
        const cart = new Cart();

        if (
          cart.cartData.items.some(
            (item) => item.product.id === parseInt(productId)
          )
        ) {
          const itemIndex = cart.cartData.items.findIndex(
            (item) => item.product.id === parseInt(productId)
          );
          cart.cartData.items[itemIndex].quantity++;
          showNotification(
            `${cart.cartData.items[itemIndex].product.title} has Been Added to Cart`
          );
          cart.updateCartTotal();
        } else {
          const product = this.products.find(
            (item) => item.id === parseInt(productId)
          );
          if (product) {
            showNotification(`${product.title} has Been Added to Cart`);
            cart.addProductToCart(product, 1);
          }
        }
      });
    });
  };
}

const productObj = new Products(productsData);

const initPage = () => {
  const path = window.location.pathname;
  if (path === "/home.html" && !localStorage.getItem("currentUser")) {
    return (window.location.href = "/");
  }
  if (logout) {
    logout.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "/";
    });
  }
  productObj.showData();
  displayUsername()
};
window.onload = initPage;
