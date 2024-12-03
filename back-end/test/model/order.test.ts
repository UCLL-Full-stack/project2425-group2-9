<<<<<<< HEAD

// import { Order } from "../../model/order"
// import { isDate, set } from 'date-fns';
// const date = new Date()
// const cartId = 2 //Q&since cartId can be optional and undefined, do we use it create tests?
// test("given: valid order input, when: placing an order, then: an order is created",()=>{
//      const order = new Order({date,cartId})
//      expect(order.getDate()).toEqual(date)//use toEqual for date validation
//      expect(order.getCartId()).toBe(cartId)
// })

// test("given: no date, when: when placing order,then: error is throw", ()=> {

//      //given
//      // when
//      const newOrder = ()=>{
//           const order:Order = new Order({cartId})
//           return order
//      }
//      //then
//      expect(newOrder).toThrow( "Date is required." )
// })
// test("given: invalid date, when: making an order, then: error is thrown.", ()=>{

//      //given
//      const invalidDate:Date = new Date('')

//      //when
//      const throwError = ()=>{
//           const order:Order = new Order({cartId,date:invalidDate})
//           return order
//      }

//      //then
//      expect(throwError).toThrow("Date is not valid.")
// })
=======
import { Order } from "../../model/order"
import { set } from 'date-fns';

const date = set(new Date(), { hours: 15, minutes: 30, seconds: 20, milliseconds: 200 })
const cartId = 2 // Q& since cartId can be optional and undefined, do we use it create tests?

test("Given valid values; When creating order; Then order is created with those values.", () => {
     // GIVEN
     // Values at the top of this file.

     // WHEN
     const order = new Order({ date, cartId })

     // THEN
     expect(order.getDate()).toEqual(date) // use toEqual for date validation
     expect(order.getCartId()).toBe(cartId)
})
>>>>>>> 6913e423f295a49071dd6922709f3b637d77f35d
