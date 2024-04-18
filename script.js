// Seletor de elementos
const seletor = function(id) {
  return document.getElementById(id);
};

const menu = seletor("menu"),
cartBtn = seletor("cart-btn"),
cartModal = seletor("cart-modal"),
cartItemsContainer = seletor("cart-items"),
cartTotal = seletor("cart-total"),
checkoutBtn = seletor("checkout-btn"),
closeModalBtn = seletor("close-modal-btn"),
cartCounter = seletor("cart-count"),
addressInput = seletor("address"),
addressWarn = seletor("address-warn"),
spanItem = seletor("date-span");

// Declarações de variáveis
let cart = []

// Abrir modal do carrinho de compras
cartBtn.addEventListener("click", function() {
  updateCartModal()
  cartModal.style.display = "flex"
})

// Fechar modal do carrinho de compras
cartModal.addEventListener("click", function(event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none"
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
})

closeModalBtn.addEventListener("click", function() {
  cartModal.style.display = "none"
  addressInput.classList.remove("border-red-500");
  addressWarn.classList.add("hidden");
})

// Adicionar items ao carrinho de compras
menu.addEventListener("click", function(event) {
  // Identificar se clicou no botão ou icone
  let parentButton = event.target.closest(".add-to-cart-btn")
  if (parentButton) {
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))

    addToCart(name, price)
  }
})

// Função para adicionar ao carrinho
function addToCart(name, price) {
  // Verificar se o item já existe no carrinho
  const existingItem = cart.find(item => item.name === name)
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      name,
      price,
      quantity: 1
    })
  }

  updateCartModal()
}

// Atualizar carrinho de compras
function updateCartModal() {
  cartItemsContainer.innerHTML = ""
  let total = 0

  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>

        <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>
      </div>
    `
    total += item.price * item.quantity

    cartItemsContainer.appendChild(cartItemElement)
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length;
}

// Função para remover do carrinho
cartItemsContainer.addEventListener("click", function(event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name")

    removeItemCart(name)
  }
})

function removeItemCart(name) {
  const index = cart.findIndex(item => item.name === name)

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1
      updateCartModal()
      return;
    }

    cart.splice(index, 1)
    updateCartModal();
  }
}

addressInput.addEventListener("input", function(event) {
  let inputValue = event.target.value

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
})

// Finalizar pedido
checkoutBtn.addEventListener("click", function() {
  const isOpen = checkrestaurantOpen()
  if (!isOpen) {
    Toastify({
      text: "Ops! O restaurante está fechado!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#EF4444",
      },
    }).showToast()
    return
  }

  if (cart.length === 0) return
  if (addressInput.value === "") {
    addressInput.classList.add("border-red-500");
    addressWarn.classList.remove("hidden");
    return
  }

  // Enviar pedido via API Whatsapp
  const cartItems = cart.map((item) => {
    return (
      ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price}`
    )
  }).join("")

  const message = encodeURIComponent(cartItems)
  const phone = "71991489769"

  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

  cart.length = 0
  updateCartModal()
})

// Verificar a hora e manipular o card de horário
function checkrestaurantOpen() {
  const data = new Date()
  const hora = data.getHours()
  return hora >= 18 && hora < 22
}

const isOpen = checkrestaurantOpen()

if (isOpen) {
  spanItem.classList.remove("bg-red-500")
  spanItem.classList.add("bg-green-600")
} else {
  spanItem.classList.add("bg-red-500")
  spanItem.classList.remove("bg-green-600")
}