import { Cart } from "../model/cart";
import { CartContainsProduct } from "../model/cartContainsProduct";
import { Customer } from "../model/customer";
import { Product } from "../model/product";
import cartDb from "../repository/cart.db";
import cartContainsProductDb from "../repository/cartContainsProduct.db";
import customerDb from "../repository/customer.db";
import productDb from "../repository/product.db";
//Q& should all methods in the service be asynchronous?
const createNewCart = async(newCustomerId:number|undefined):Promise<Cart|null> =>{
    const customer = customerDb.getCustomerById(newCustomerId);
    // If customer exists AND customer does not have a cart.
    if (!customer) throw new Error(`Customer is falsy in service. Value: ${customer}`);
    const hasCart = cartDb.getCartByCustomerId(customer.getId());
    if (hasCart) throw new Error(`Customer has a cart.`);
    // True && False => False
    if (customer && !hasCart){//Q& customer does not have a cart
        customer.setId(newCustomerId);
        const newCart = new Cart({
            id: cartDb.returnAllCartsAvailable().length + 1,
            totalPrice: 0,
            customerId: customer.getId(),
        });
        cartDb.saveCart(newCart);
        return newCart;
    }
    return null;
}
 
const addProductToCart = async(customerData:Customer,product:Product):Promise<Cart|null>=>{
    const existingCart: Cart | null = await cartDb.getCartByCustomerId(customerData.getId())
    if (existingCart){
        try{
             const cartId = existingCart.getId();
             if (cartId === undefined) {
                 throw new Error("Cart ID is undefined");
             }
             const existingProduct = await productDb.getProductByName(product.getName())
             if (!existingProduct){
                throw new Error("product does not exist")
             }
             const cartItem = await cartContainsProductDb.getCartByCartIdAndProductName(cartId,existingProduct.getName())
             if (!cartItem) throw new Error("no card found")
             if (cartItem){
                cartItem.setQuantity(cartItem.getQuantity()+1)
             }else{
                const newCartItem = new CartContainsProduct({ cartId, productName: existingProduct.getName(), quantity:0 });
                cartContainsProductDb.addOrUpdateProduct(newCartItem)
             } 
             return existingCart
        }catch(e){
            console.error(e)
        }   
    }else{
        //no cart, then create new cart
        const fetchProduct = await productDb.getOrSaveProductByName(product.getName(),product)
        if (!fetchProduct) throw new Error("product repo returned null")
            const newProduct = productDb.saveNewProduct(fetchProduct)
        if (!newProduct) throw new Error("product was not added")
        const newCart =await createNewCart(customerData.getId())
        if (!newCart) throw new Error("no customer found")
            const newCartItem = new CartContainsProduct({ cartId: newCart.getId(), productName: newProduct.getName(), quantity: 0 });
            await cartContainsProductDb.addOrUpdateProduct(newCartItem);
        return newCart
    }
    return null
}
const getCartInformation = async():Promise<Cart[]|null>=>{
    if (!cartDb.returnAllCartsAvailable()) {
        throw new Error("Database is empty")
    }
    return cartDb.returnAllCartsAvailable()||null//Q& i don't know if we need this, i,just thought of implementing it
}
const returnAllProductsInCart = async(customersId:number|undefined):Promise<Product[]|null> =>{
    try{
        const cart = await cartDb.getCartByCustomerId(customersId)
    if (!cart)
        throw new Error("cart does not exist")
   const cartId = cart.getId()
   if (!cartId)
    throw new Error("no card with id:"+`${cartId}`)
   const [fetchProductInCart] = await Promise.all([cartContainsProductDb.getCartItemNamesByCartId(cartId)])//Q& am not so sure if we should use promise.all for now since it just returns one promise
   if (!fetchProductInCart)
    throw new Error("your cart is empty, please add products to it")
   const products: Product[] = await Promise.all(fetchProductInCart.map(async (productName: string) => {
       const product = await productDb.getProductByName(productName);
       if (!product) throw new Error(`Product with name ${productName} not found`);
       return product;
   }));
   return products;

    }catch(e){
        console.log(e)
    }
    return null
    
}
export default{createNewCart,getCartInformation,addProductToCart,returnAllProductsInCart}