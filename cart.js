import { displayUsername } from "./main.js";

const CartProductsContainer = document.getElementsByClassName("cart-products");
const CartTotalsContainer = document.getElementsByClassName("cart-totals");
const EmptyCartContainer = document.getElementsByClassName("empty-cart");
const logout = document.getElementById("logout");

export class Cart {
  constructor() {
    const storedCart = localStorage.getItem("cart");
    this.cartData = storedCart
      ? JSON.parse(storedCart)
      : {
          items: [],
          total: 0,
        };
  }

  addProductToCart(product, quantity) {
    const itemId = Math.floor(Math.random() * 10000);
    this.cartData.items.push({ id: itemId, product, quantity });
    this.updateCartTotal();
  }

  updateCartTotal() {
    this.cartData.total = this.cartData.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    localStorage.setItem("cart", JSON.stringify(this.cartData));
  }

  showCartProducts() {
    CartProductsContainer[0].innerHTML = "";
    const tableHead = document.createElement("div");
    tableHead.classList.add(
      ...[
        "flex",
        "items-center",
        "justify-between",
        "w-full",
        "p-3",
        "border-b",
        "border-slate-200",
      ]
    );
    tableHead.classList.add("min-w-[600px]");

    tableHead.innerHTML = `
    <h1 class="text-md font-semibold text-black truncate">
            image
          </h1>
          <h1 class="text-md font-semibold text-black w-[200px] truncate">
            title
          </h1>
          <h1 class="text-md font-semibold text-black">Price</h1>
          <p class="text-sm text-gray-600">Quantity</p>
          <button class="text-red-500 text-sm">Action</button>
    `;

    CartProductsContainer[0].append(tableHead);
    this.cartData.items.forEach((item) => {
      const productItem = document.createElement("div");
      productItem.classList.add(
        ...[
          "flex",
          "items-center",
          "justify-between",
          "w-full",
          "p-3",
          "border-b",
          "border-slate-200",
        ]
      );
      productItem.classList.add("min-w-[600px]");

      productItem.innerHTML = `
          <img src=${item.product.image} alt=${
        item.product.title
      } class="w-[70px] h-[70px]" />
          <h1 class="text-md font-semibold text-black w-[200px] truncate">${
            item.product.title
          }</h1>
          <h1 class="text-md font-semibold text-black">$${(
            item.product.price * item.quantity
          ).toFixed(2)}</h1>
          <div class="flex items-center gap-3">
            <button class="border-[1px] rounded-sm border-slate-300 px-2 decrease">-</button>
            <p class="text-sm text-gray-600">${item.quantity}</p>
            <button class="border-[1px] rounded-sm border-slate-300 px-2 increase">+</button>
          </div>
          <button class="text-red-500 text-sm delete">Delete</button>
        `;

      productItem.querySelector(".delete")?.addEventListener("click", () => {
        this.cartData.items = this.cartData.items.filter(
          (i) => i.product.id !== item.product.id
        );
        this.updateCartTotal();
        productItem.remove();
        updateCartTotalUI();
      });

      productItem.querySelector(".increase")?.addEventListener("click", () => {
        const cartItem = this.cartData.items.find(
          (i) => i.product.id === item.product.id
        );
        if (cartItem) {
          cartItem.quantity++;
          this.updateCartTotal();
          productItem.querySelector("p").textContent = cartItem.quantity;
          updateCartTotalUI();
        }
      });

      productItem.querySelector(".decrease")?.addEventListener("click", () => {
        const cartItem = this.cartData.items.find(
          (i) => i.product.id === item.product.id
        );
        if (cartItem && cartItem.quantity > 1) {
          cartItem.quantity--;
          this.updateCartTotal();
          productItem.querySelector("p").textContent = cartItem.quantity;
          updateCartTotalUI();
        }
      });

      CartProductsContainer[0].append(productItem);
    });

    const updateCartTotalUI = () => {
      CartTotalsContainer[0].innerHTML = `
          <div class="flex items-center justify-between gap-3 w-full p-3 border-b border-slate-200">
            <h1 class="text-md font-semibold">Total: </h1>
            <p class="text-slate-700 text-sm font-medium">$${this.cartData.total.toFixed(
              2
            )}</p>
          </div>
        `;
    };
  }
}

const cartObj = new Cart();

const initPage = () => {
  const path = window.location.pathname;
  if (path === "/cart.html" && !localStorage.getItem("currentUser")) {
    window.location.href = "/";
  }
  logout.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "/";
    });
  displayUsername();
  if (cartObj.cartData.items.length > 0) {
    CartProductsContainer[0].classList.add("border", "border-slate-200");
    CartTotalsContainer[0].classList.add("border", "border-slate-200");

    cartObj.showCartProducts();
    const totalDiv = document.createElement("div");
    totalDiv.classList.add(
      "flex",
      "items-center",
      "justify-between",
      "gap-3",
      "w-full",
      "p-3",
      "border-b",
      "border-slate-200"
    );
    totalDiv.innerHTML = `
<h1 class="text-md font-semibold">Total: </h1>
<p class="text-slate-700 text-sm font-medium">$${cartObj.cartData.total.toFixed(
      2
    )}</p>
`;
    CartTotalsContainer[0].appendChild(totalDiv);
  } else {
    const EmptyCart = document.createElement("div");
    EmptyCart.classList.add(
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "gap-3",
      "w-full",
      "h-full",
      "max-w-[350px]",
      "mx-auto",
      "p-3"
    );

    EmptyCart.innerHTML = `
        <h1 class="text-md font-semibold text-center">You Don't Have any products in the cart </h1>
        <button class="w-full rounded-md bg-[#2b38d1] text-white border-0 text-sm py-2 hover:bg-black">
            <a href="home.html">Start Shopping</a>
        </button>`;
    EmptyCartContainer[0].appendChild(EmptyCart);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const openSidebarBtn = document.querySelector("#open-sidebar-btn");
  const closeSidebarBtn = document.querySelector("#close-sidebar-btn");

  if (openSidebarBtn) {
    openSidebarBtn.addEventListener("click", () => {
      document.querySelector(".sidebar").classList.remove("hidden");
    });
  }

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener("click", () => {
      document.querySelector(".sidebar").classList.add("hidden");
    });
  }
});


window.onload = initPage;
