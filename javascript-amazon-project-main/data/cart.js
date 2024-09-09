
export let cart;
loadFromStorage();
function saveToStroage(){

  localStorage.setItem('cart',JSON.stringify(cart) );
}
export function loadFromStorage(){
    cart =  JSON.parse(localStorage.getItem('cart'));

  if(!cart){
    cart =
    [{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1'
    },{
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2'
    }
    ];
  }
  
}

export function addToCart(productId,selectedQuantity){
  let matchingItem;
  cart.forEach((cartItem)=> {
    if(productId === cartItem.productId){
      matchingItem = cartItem;
    };
  });
  
  if(matchingItem){
    matchingItem.quantity = matchingItem.quantity + selectedQuantity;
  } else{
    cart.push({
      productId: productId,
      quantity: selectedQuantity,
      deliveryOptionId: '1'
    });
  };

  saveToStroage();
}

export function removeForCart(productId){
const newCart = [];
 cart.forEach((cartItem)=>{
    if(cartItem.productId !== productId){
      newCart.push(cartItem);
    }
 })
 cart = newCart;
 saveToStroage();
}

export function makeCartEmpty(){
  const newCart = [];
   
   cart = newCart;
   saveToStroage();
  }
export function updateQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity = newQuantity;

  saveToStroage();
}


export function calculateCartQuantity() {
  let cartQuantity = 0;
  console.log(cart)
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStroage();
}

export function loadCart(fun){
  const xht = new XMLHttpRequest();
  xht.addEventListener('load', ()=>{
    
    fun();
    
  })
  xht.open('GET', 'https://supersimplebackend.dev/cart');
  xht.send();

  


}