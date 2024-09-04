export let cart =  JSON.parse(localStorage.getItem('cart'));

if(!cart){
  [{
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2
  },{
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1
  }
  ];
}


function saveToStroage(){

  localStorage.setItem('cart',JSON.stringify(cart) );
}

export function addToCart(productId){
  let matchingItem;
  cart.forEach((cartItem)=> {
    if(productId === cartItem.productId){
      matchingItem = cartItem;
    };
  });
  
  if(matchingItem){
    matchingItem.quantity +=1;
  } else{
    cart.push({
      productId: productId,
      quantity: 1
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

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}