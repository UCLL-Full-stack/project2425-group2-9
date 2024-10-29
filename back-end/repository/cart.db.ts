
import { Cart } from "../model/cart";
const carts: Cart[] = [
    new Cart({
        id: 1,
        totalPrice: 0,
        customerId: 1,
    })
];
//you need to save the cart after creating it

const saveCart = (cart:Cart):Cart|undefined=>{
     const existingCart = carts.findIndex((c)=>{
        cart.getId()=== c.getId()
     })
     if (existingCart!==-1){
        carts[existingCart] = cart
     }else{
        carts.push(cart)
     }
     return cart
}


const getCartByCustomerId = (customerId: number|undefined): Cart | null => {
    return carts.find((cart) => cart.getCustomerId() === customerId) || null;
}
//get cart
const returnAllCartsAvailable = ():Cart[]|null=>{
    return carts
}


export default {
    getCartByCustomerId,
    saveCart,
    returnAllCartsAvailable
};