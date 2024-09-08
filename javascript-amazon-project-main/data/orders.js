export const orders = JSON.parse(localStorage.getItem('order')) || []

export function addOrder(order){
  orders.unshift(order)
  saveToStroage()

}
function saveToStroage(){
  localStorage.setItem('orders', JSON.stringify(orders))
}