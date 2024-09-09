import { getOrder, orders } from "../data/orders.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

async function loadPage() {
  // Ensure products are loaded
  await loadProductsFetch();

  // Get the current URL and extract orderId and productId parameters
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  // Get the specific order by orderId
  const order = getOrder(orderId);

  const product = getProduct(productId);
  
  //console.log(product)
  // Check if the order exists and contains products
  if (!order) {
    console.error('Order not found or contains no products');
    return;
  }
  let productDetails = product;
 
  if (!productDetails ) {
    console.error('Product not found in order');
    return;
  }
  let quantity;
  order.forEach((orderItem) => {
    if(orderItem.id === orderId){
      let productsOfOrder = orderItem.products
      productsOfOrder.forEach((product)=>{
        if(product.productId === productId){
            quantity = product.quantity
        }
        
      })
    }
      
  });
 

  const deliveryDate = dayjs(productDetails.estimatedDeliveryTime).format('dddd, MMMM D');

  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on ${deliveryDate}
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${quantity}
    </div>

    <img class="product-image" src="${product.image}">

    <div class="progress-labels-container">
      <div class="progress-label">Preparing</div>
      <div class="progress-label current-status">Shipped</div>
      <div class="progress-label">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar"></div>
    </div>
  `;

  // Insert the generated HTML into the DOM
  document.querySelector('.js-order-tracking').innerHTML = trackingHTML;
}

// Load the page and render the order tracking information
loadPage();

