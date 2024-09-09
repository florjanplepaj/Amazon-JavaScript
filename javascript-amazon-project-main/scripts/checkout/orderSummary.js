import { cart, removeForCart , updateQuantity,updateDeliveryOption} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOtions, getDeliveryOption } from "../../data/deleveryOption.js";
import { renderPaymentSummary } from "./paymentSummary.js";


export function renderOrderSummary(){

  let cartSummeryHTML = '';
  cart.forEach((cartItem)=>{
    const productId = cartItem.productId;
  
    const matchingProduct = getProduct(productId);
    
  
    const deleveryOptionId = cartItem.deliveryOptionId;

    
    const deleveryOption = getDeliveryOption(deleveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deleveryOption.deleveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
  
  
  
   cartSummeryHTML +=  `
    <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
          <div class="delivery-date">
            Delivery date: ${dateString}
          </div>
  
          <div class="cart-item-details-grid">
            <img class="product-image"
              src="${matchingProduct.image}">
  
            <div class="cart-item-details">
              <div class="product-name">
                ${matchingProduct.name}
              </div>
              <div class="product-price">
               ${matchingProduct.getPrice()}
              </div>
              <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                <span>
                 Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                <span class="update-quantity-link link-primary js-update-link " data-product-id="${matchingProduct.id}">
                  Update
                </span>
                <input class="quantity-input js-quantity-input-${matchingProduct.id}">
              <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>
                <span class="delete-quantity-link
                 link-primary js-delete-quantity js-delete-link-${matchingProduct.id}"
                 data-product-id="${matchingProduct.id}">
                  Delete
                </span>
              </div>
            </div>
  
            <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>
              ${deleveryOptionHTML(matchingProduct,cartItem)}
            </div>
          </div>
        </div>
    
    `;
  });
  function deleveryOptionHTML(matchingProduct,cartItem){
    let html = '';
    deliveryOtions.forEach((deleveryOption) =>{
      const today = dayjs();
      const deliveryDat = today.add(deleveryOption.deleveryDays, 'days');
      const dateString = deliveryDat.format('dddd, MMMM D');
  
      const priceString = deleveryOption.priceCents === 0 
      ? `Free`
      : `$${formatCurrency(deleveryOption.priceCents)} -`;
      const isChecked = deleveryOption.id === cartItem.deliveryOptionId;
      
  
      html += `
          <div class="delivery-option js-delivery-option"
            data-product-id="${matchingProduct.id}"
            data-delivery-option-id="${deleveryOption.id}">
            <input type="radio"
              ${isChecked ? 'checked' : ''}
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                ${dateString}
              </div>
              <div class="delivery-option-price">
                ${priceString} Shipping
              </div>
            </div>
          </div>
        `
    })
    return html;
  }
  
  document.querySelector('.js-order-summary').innerHTML = cartSummeryHTML;
  
  document.querySelectorAll('.js-delete-quantity').forEach((link)=>{
  link.addEventListener('click', ()=>{
   const productId = link.dataset.productId;
   removeForCart(productId);
   renderPaymentSummary();
  
  const container = document.querySelector(`.js-cart-item-container-${productId}`);
  container.remove();
  updateCartQuantityCheckout();
  
  });
  updateCartQuantityCheckout();
  
  });
  
  document.querySelectorAll('.js-update-link').forEach((link)=>{
    link.addEventListener('click',()=>{
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');
  
  
    } );
  
  });
  
  document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
  
        const quantityInput = document.querySelector(
          `.js-quantity-input-${productId}`
        );
  
      
        const newQuantity = Number(quantityInput.value);
  
        updateQuantity(productId, newQuantity);
  
        if (newQuantity < 0 || newQuantity >= 1000) {
          alert('Quantity must be at least 0 and less than 1000');
          return;
        }
        
        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.remove('is-editing-quantity');
        
        const quantityLabel = document.querySelector(
          `.js-quantity-label-${productId}`
        );
        quantityLabel.innerHTML = newQuantity;
  
        renderPaymentSummary();
        updateCartQuantityCheckout();
      });
    });

    function updateCartQuantityCheckout() {
      let cartQuantity = 0;
      cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
      });
      cartQuantity = `${cartQuantity} items`;
    
      const cartQuantityElement = document.querySelector('.js-cart-quantity-checkout');
      if (cartQuantityElement) {
        cartQuantityElement.innerHTML = cartQuantity;
      } else {
        console.warn('Cart quantity element not found');
      }
    }
    
  
  document.querySelectorAll('.js-delivery-option')
  .forEach((element) => {
    element.addEventListener('click', () => {
      const {productId, deliveryOptionId} = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
      
    });
  });
  
  

}

