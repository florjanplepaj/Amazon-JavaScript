export const orders = JSON.parse(localStorage.getItem('orders')) || []

export function addOrder(order){
  orders.unshift(order)
  saveToStroage()
  console.log(order)

}


function saveToStroage(){
  localStorage.setItem('orders', JSON.stringify(orders))
}
export function getOrder(orderId){
  let matchingOrder;
  orders.forEach((order) => {
    
    if (order.id === orderId){
      matchingOrder = orders

    }
    
  });
    return matchingOrder;
  

}

export function getCartProduct(productId) {
  // Iterate over each order in orders
  for (const orderItem of orders) {
    const orderProducts = orderItem.products;

    // Iterate over each product in the order
    for (const product of orderProducts) {
      if (product.productId === productId) {
        return product;
      }
    }
  }
  
  
  return null;  
}
export function findProductDetails(cartItemId) {
  return orders.find(product => {
    return product.productId === cartItemId;
    });
};

/*
function toJSON() {
  return {
    id: this.#id,
    orderTimeMs: this.#orderTimeMs,
    totalCostCents: this.#totalCostCents,
    products: this.#products
  };
};*/
