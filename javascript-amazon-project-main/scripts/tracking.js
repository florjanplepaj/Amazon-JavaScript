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
  let orderTime;
  let deliveryTime;

  order.forEach((orderItem) => {
    if(orderItem.id === orderId){
      orderTime = orderItem.orderTime;
      let productsOfOrder = orderItem.products
      productsOfOrder.forEach((product)=>{
        if(product.productId === productId){
            quantity = product.quantity
            deliveryTime = product.estimatedDeliveryTime


            
        }
        
      })
    }
      
  });
  
 
  
  const deliveryDate = dayjs(deliveryTime).format('dddd, MMMM D');
    


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
      <div class="progress-bar js-calculate-progess"></div>
    </div>
  `;
  document.querySelector('.js-order-tracking').innerHTML = trackingHTML;
   const barProgress =calculateProgress(deliveryTime,orderTime)
  
   const progressBar = document.querySelector('.progress-bar');
// Set the width based on barProgress
progressBar.style.width = `${barProgress}%`;

}

function calculateProgress(deliveryDate, orderTime) {
  // Convert deliveryDate and orderTime to Day.js objects
  const deliveryDateObj = dayjs(deliveryDate);
  const orderDateObj = dayjs(orderTime);
  const today = dayjs();
  

  const differenceCurrentAndOrder = today.diff(orderDateObj, 'minute');
  
  const differenceDeliveryAndOrder = deliveryDateObj.diff(orderDateObj, 'minute');

 
  const differenceComplete = ((differenceCurrentAndOrder / differenceDeliveryAndOrder) * 100);

  return Math.min(Math.max(differenceComplete, 0), 100);
}


loadPage();

