import { addToCart, cart, makeCartEmpty } from "../data/cart.js";
import { getDeliveryOption } from "../data/deleveryOption.js";
import { getCartProduct, orders, findProductDetails } from "../data/orders.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import formatCurrency from "./utils/money.js";
import { getProduct, loadProducts } from "../data/products.js";

let orderSummaryHTML = '';

loadProducts(renderOrderCheckout);

function renderOrderCheckout() {
  makeCartEmpty();
  orders.forEach((orderItem) => {
    const orderId = orderItem.id;
    const products = orderItem.products;

    const orderTimeMs = orderItem.orderTime;
    const orderDate = dayjs(orderTimeMs);
    const dateString = orderDate.format('MMMM D');
    const totalPriceOrder = orderItem.totalCostCents;

    // Create the order header once per order
    orderSummaryHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${dateString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(totalPriceOrder)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${orderId}</div>
          </div>
        </div>
    `;

   
    products.forEach((productItem) => {
      const productId = productItem.productId;
      const matchingOrder = getCartProduct(productId);
      const orderTimes = productItem.estimatedDeliveryTime;
      const deliveryDate = dayjs(orderTimes);
      const deliverydateString = deliveryDate.format('MMMM D');
      const productInfo = getProduct(productId);
      

      orderSummaryHTML += `
        <div class="order-details-grid">
          <div class="product-image-container">
            <img src="${productInfo.image}">
          </div>
          <div class="product-details">
            <div class="product-name">${productInfo.name}</div>
            <div class="product-delivery-date">Arriving on: ${deliverydateString}</div>
            <div class="product-quantity">Quantity: ${matchingOrder.quantity}</div>
            <button class="buy-again-button button-primary js-buy-again-button " data-product-id="${productId}">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>
          <div class="product-actions">
            
              <button class="track-package-button button-secondary js-track-package-button" data-order-id="${orderId}" data-product-id="${productInfo.id}">Track package</button>

            </a>
          </div>
        </div>
      `;
    });

    
    // Close the order container after all products are added
    orderSummaryHTML += `</div>`;
  });

  


  // Inject the complete order summary into the container
  document.querySelector('.order-summary-container').innerHTML = orderSummaryHTML;

  updateCartQuantityCheckout();
  document.querySelectorAll('.js-track-package-button').forEach((button) => {
    button.addEventListener('click', () => {
      // Corrected dataset property names
      console.log(button.dataset)
      const orderId = button.dataset.orderId;
      const productId = button.dataset.productId;
  
      goToOrderTracking(orderId, productId);
    });
  });

  buyAgainButton()
}
function goToOrderTracking(orderId, productId) {
  const url = `tracking.html?orderId=${orderId}&productId=${productId}`;
  window.location.href = url;
}

function updateCartQuantityCheckout(){
  let cartQuantityPayment = 0;
  cart.forEach((cartItem)=>{
    cartQuantityPayment += cartItem.quantity;

  })
  
 
  document.querySelector('.js-order-quantity-checkout').innerHTML = cartQuantityPayment  ;
    
  
}
function buyAgainButton(){
  document.querySelectorAll('.js-buy-again-button').forEach((button)=>{
    button.addEventListener('click',()=>{
      const productId = button.dataset.productId
      addToCart(productId)
    })
   
  })
}
