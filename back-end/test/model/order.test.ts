
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