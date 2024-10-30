import { CartContainsProduct } from "../model/cartContainsProduct";


const cartContainsProduct: CartContainsProduct[] = [
    new CartContainsProduct({ cartId: 1, productName: "Bread", quantity: 2 }),
    new CartContainsProduct({cartId:1,productName:"Laptop",quantity:5}),
    new CartContainsProduct({cartId:1,productName:"Mayonnaise",quantity:5})
];

const getCartItemNamesByCartId = (id: number): string[] => {
    const itemNames: string[] = [];
    for (let item of cartContainsProduct) {
        if (item.getCartId() === id) {
            const productName = item.getProductName();
            if (productName) {
                itemNames.push(productName);
            }
        }
    }
    return itemNames;
};

const getCartByCartIdAndProductName = (cardId:number|undefined,productName:string|undefined):CartContainsProduct |undefined=>{
    const nameAndIdCheck = cartContainsProduct.find((e)=>{
        e.getCartId()=== cardId && e.getProductName() === productName
    })
    if (!nameAndIdCheck){
        throw new Error("product  does not exist in cart")
    }
    return nameAndIdCheck
}

const addOrUpdateProduct = (cartItem:CartContainsProduct):CartContainsProduct=>{
    const existingCartItem = getCartByCartIdAndProductName(cartItem.getCartId(),cartItem.getProductName())
    if (existingCartItem){
        cartItem.setQuantity(existingCartItem.getQuantity()+cartItem.getQuantity())
    }else{
        cartContainsProduct.push(cartItem)
    }
    return cartItem
}
// const getCartItemByCartId, returns a list of all items with the correct cart id.
const returnAllItemsInCart = (cartId:number|undefined):CartContainsProduct[]=>{
    return cartContainsProduct.filter(item =>item.getCartId() === cartId)
}//now we have a list of carts that match a particular cart id

const deleteCartItemByCartIdAndProductName = (cartId: number|undefined, name: string): string => {
    for (let i = 0; i < cartContainsProduct.length; i++) {
        if (cartContainsProduct[i].getProductName() === name && cartContainsProduct[i].getCartId() === cartId) {
            cartContainsProduct.splice(i, 1);
            return "Successfully deleted item from cart.";
        }
    }
    return "Item not in cart."
};
 const getProductsByNameInCart = (cartId:number|undefined,productName:string):CartContainsProduct[]=>{
    return returnAllItemsInCart(cartId).filter((matchingCart)=>matchingCart.getProductName()=== productName)
 }

export default {
    getCartItemNamesByCartId,
    deleteCartItemByCartIdAndProductName,
    getCartByCartIdAndProductName,
    addOrUpdateProduct,
    getProductsByNameInCart
}