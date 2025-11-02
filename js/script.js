const api = "https://68faeedd94ec96066023f9af.mockapi.io/api/postappv1/zonuz";
const cardContent = document.querySelector("#cards");
const productsContent = document.querySelector("#products_content");
const favoriteContent = document.querySelector("#favorite_content");
const adminProducts = document.querySelector(".admin-products");
const addForm = document.querySelector("#add_form");

async function getData(api) {
  try {
    const res = await fetch(api);
    const data = await res.json();

    const likedItems = JSON.parse(localStorage.getItem("liked")) || [];

    if (!cardContent) return;
    cardContent.innerHTML = "";

    data.forEach((item) => {
      const newCard = document.createElement("div");
      newCard.className =
        "card relative shadow-sm rounded-[10px] p-[10px] flex flex-col justify-between group";
      newCard.innerHTML = `
        <i
            class="fa-solid z-20 fa-heart absolute top-0 right-0 text-[#777676] cursor-pointer like-icon text-[18px] m-[10px]"
            data-id="${item.id}"
          ></i>
          <img
            src="${item.img}"
            alt="${item.title}"
            class="scale-92 group-hover:scale-100 duration-400"
          />
          <p class="text-[14px]">${item.title}</p>
          <div class="flex justify-between items-end mt-[20px]">
            <p class="font-semibold text-[14px]">${item.price}</p>
            <div class="inline-block cursor-pointer add-cart border rounded-full border-[#0000003d] active:border-blue-700 p-[5px]">
              <img src="./assets/svg/add_cart.svg" alt="cart" class="w-[20px]" />
            </div>
          </div>
      `;

      const likeIcon = newCard.querySelector(".like-icon");
      if (likedItems.some((i) => i.id === item.id))
        likeIcon.style.color = "red";

      likeIcon.addEventListener("click", () => toggleLike(item, likeIcon));
      newCard
        .querySelector(".add-cart")
        .addEventListener("click", () => addToCart(item));

      cardContent.prepend(newCard);
    });
  } catch (err) {
    console.log("Xatolik:", err);
  }
}
if (cardContent) getData(api);

function toggleLike(item, icon) {
  let likedItems = JSON.parse(localStorage.getItem("liked")) || [];
  const exists = likedItems.some((i) => i.id === item.id);

  if (exists) {
    likedItems = likedItems.filter((i) => i.id !== item.id);
    icon.style.color = "#777676";
  } else {
    likedItems.push(item);
    icon.style.color = "red";
  }
  localStorage.setItem("liked", JSON.stringify(likedItems));
}

function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem("data")) || [];
  const existing = cart.find((p) => p.id == item.id);
  if (existing) existing.quantity++;
  else cart.push({ ...item, quantity: 1 });
  localStorage.setItem("data", JSON.stringify(cart));
  renderCart();
}

const checkoutBox = document.querySelector("#checkout_box");
const totalBox = document.querySelector("#total_price");
const deliveryBox = document.querySelector("#delivery_price");

function renderCart() {
  if (!productsContent) return;
  const cart = JSON.parse(localStorage.getItem("data")) || [];
  productsContent.innerHTML = "";
  let total = 0;
  const delivery = 71000;

  if (cart.length === 0) {
    checkoutBox.classList.add("hidden");
    productsContent.innerHTML = `
      <div class="border border-[#E5E7EB] w-full rounded-[5px] p-[20px] mt-[20px]">
        <h2 class="text-[26px] font-bold">Корзина</h2>
        <p class="mt-[10px] text-[20px] font-bold">Ваша корзина пусто</p>
        <a href="../index.html" class="inline-block w-[205px] px-[55px] py-[10px] bg-[#6682A9] text-white rounded-[5px] mt-[15px] hover:opacity-85">
          На главную
        </a>
      </div>
    `;
    if (totalBox) totalBox.textContent = `0 сум`;
    return;
  }

  checkoutBox.classList.remove("hidden");

  cart.forEach((item) => {
    const cleanPrice = Number(item.price.replace(/\D/g, ""));
    total += item.quantity * cleanPrice;

    const newProduct = document.createElement("div");
    newProduct.className = "product flex items-center justify-between w-full mb-[10px]";
    newProduct.innerHTML = `
    <div class='flex items-center gap-[60px]'>
    <img src="${item.img}" alt="${item.title}" class="w-[80px]" />
    <div>
      <p>${item.title}</p>
      <button onclick="removeItem('${item.id}')" class="cursor-pointer text-red-600">Удалить</button>
    </div>
    </div>
      <div class="flex gap-[10px] items-center">
        <button onclick="incr('${item.id}')" class="bg-gray-200 px-2 rounded cursor-pointer">+</button>
        <span>${item.quantity}</span>
        <button onclick="decr('${item.id}')" class="bg-gray-200 px-2 rounded cursor-pointer">-</button>
      </div>
      <p>${(item.quantity * cleanPrice).toLocaleString()} сум</p>
    `;
    productsContent.prepend(newProduct);
  });

  const finalTotal = total + delivery;
  totalBox.textContent = `${finalTotal.toLocaleString()} сум`;
}

function incr(id) {
  let cart = JSON.parse(localStorage.getItem("data")) || [];
  const item = cart.find((p) => p.id == id);
  if (item) item.quantity++;
  localStorage.setItem("data", JSON.stringify(cart));
  renderCart();
}

function decr(id) {
  let cart = JSON.parse(localStorage.getItem("data")) || [];
  const item = cart.find((p) => p.id == id);
  if (item && item.quantity > 1) item.quantity--;
  else cart = cart.filter((p) => p.id !== id);
  localStorage.setItem("data", JSON.stringify(cart));
  renderCart();
}

function removeItem(id) {
  let cart = JSON.parse(localStorage.getItem("data")) || [];
  cart = cart.filter((p) => p.id !== id);
  localStorage.setItem("data", JSON.stringify(cart));
  renderCart();
}

renderCart();

function getFavoriteItem() {
  if (!favoriteContent) return;
  const likedData = JSON.parse(localStorage.getItem("liked")) || [];

  favoriteContent.innerHTML = "";

  likedData.forEach((item) => {
    const newFavorite = document.createElement("div");
    newFavorite.className =
      "card relative shadow-sm rounded-[10px] p-[10px] flex flex-col justify-between group";
    newFavorite.innerHTML = `
      <i
        class="fa-solid z-20 fa-heart absolute top-0 right-0 text-red-500 cursor-pointer like-icon text-[18px] m-[10px]"
        data-id="${item.id}" onclick="removeFavorite('${item.id}')"
      ></i>
      <img
        src="${item.img}"
        alt="${item.title}"
        class="scale-92 group-hover:scale-100 duration-400"
      />
      <p class="text-[14px]">${item.title}</p>
      <div class="flex justify-between items-end mt-[20px]">
        <p class="font-semibold text-[14px]">${item.price}</p>
        <div class="inline-block cursor-pointer add-cart border rounded-full border-[#0000003d] active:border-blue-700 p-[5px]">
          <img src="../assets/svg/add_cart.svg" alt="cart" class="w-[20px]" />
        </div>
      </div>
    `;

    // 🔹 Add to cart event qo‘shamiz
    newFavorite.querySelector(".add-cart").addEventListener("click", () => {
      addToCart(item);
    });

    favoriteContent.prepend(newFavorite);
  });
}

function removeFavorite(id) {
  let likedData = JSON.parse(localStorage.getItem("liked")) || [];
  likedData = likedData.filter((item) => item.id !== id);
  localStorage.setItem("liked", JSON.stringify(likedData));
  getFavoriteItem();
}

if (favoriteContent) getFavoriteItem();

let isEdit = false;
let editId = null;

async function getAdminData() {
  try {
    const res = await fetch(api);
    const data = await res.json();
    if (!adminProducts) return;

    adminProducts.innerHTML = "";
    data.forEach((item) => {
      const newAdminProduct = document.createElement("div");
      newAdminProduct.className =
        "admin-product flex items-center justify-between border-b py-2";
      newAdminProduct.innerHTML = `
        <div class='flex gap-[20px] items-center'>
          <img src="${item.img}" alt="img" class='w-[50px] h-[50px] object-cover rounded'>
          <p>${item.title}</p>
          <p>${item.price}</p>
        </div>
        <div>
          <i class="fa-solid fa-pen-to-square text-blue-600 cursor-pointer" data-id="${item.id}"></i>
          <i class="fa-solid fa-trash text-red-600 cursor-pointer" data-id="${item.id}"></i>
        </div>
      `;
      adminProducts.prepend(newAdminProduct);
    });
  } catch (err) {
    console.log("Xato:", err);
  }
}
getAdminData();

if (addForm) {
  const inputs = addForm.querySelectorAll("input");

  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = inputs[0].value.trim();
    const price = inputs[1].value.trim();
    const img = inputs[2].value.trim();
    if (!title || !price || !img) return alert("Barcha maydonlarni to‘ldiring!");

    const newProduct = { title, price, img };

    try {
      if (isEdit) {
        await fetch(`${api}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        });
        isEdit = false;
        editId = null;
        addForm.querySelector("button").textContent = "Submit";
        alert("Mahsulot yangilandi");
      } else {
        await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        });
        alert("Mahsulot qo‘shildi");
      }
      addForm.reset();
      getAdminData();
    } catch (err) {
      console.log("Xato:", err);
    }
  });

  adminProducts.addEventListener("click", async (e) => {
    const target = e.target;
    const id = target.dataset.id;

    if (target.classList.contains("fa-trash")) {
      if (!confirm("O‘chirishni tasdiqlaysizmi?")) return;
      await fetch(`${api}/${id}`, { method: "DELETE" });
      getAdminData();
    }

    if (target.classList.contains("fa-pen-to-square")) {
      const res = await fetch(`${api}/${id}`);
      const data = await res.json();
      inputs[0].value = data.title;
      inputs[1].value = data.price;
      inputs[2].value = data.img;
      isEdit = true;
      editId = id;
      addForm.querySelector("button").textContent = "Update";
    }
  });
}
