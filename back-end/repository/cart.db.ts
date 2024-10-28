
import { Cart } from "../model/cart";
const carts: Cart[] = [
    new Cart({
        id: 1,
        totalPrice: 0,
        customerId: 1,
    })
];
//you need to save the cart after creating it

const saveCart = (cart:Cart):void=>{
     const existingCart = carts.findIndex((c)=>{
        cart.getId()=== c.getId()
     })
     if (existingCart!==-1){
        carts[existingCart] = cart
     }else{
        carts.push(cart)
     }
}

const getCartByCustomerId = (customerId: number|undefined): Cart | null => {
    return carts.find((cart) => cart.getCustomerId() === customerId) || null;
}
//get cart
const returnAllCartsAvailable = ():Cart[]=>{
    return carts
}


export default {
    getCartByCustomerId,
    saveCart,
    returnAllCartsAvailable
};