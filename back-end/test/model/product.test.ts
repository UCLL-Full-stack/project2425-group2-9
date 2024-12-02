import { Product } from "../../model/product";

const name = "I-phone 16 pro max"
const price = 1200;
const unit = "Euros";
const stock = 200
const description = "The iPhone 16 Pro Max features a stunning 6.9-inch Super Retina XDR display with a resolution of 2868x1320 pixels, delivering vibrant colors and sharp details. Encased in a durable titanium design, it offers exceptional durability and a sleek look. "
const imagePath = "C:\Users\HOME\OneDrive\Desktop\UCLL\FULLSTACK\project2425-group2-9\back-end\images\apple_iphone-16-pro-max-256-brz_7726759_1.jpg"


test("given:valid product input, when: registering/storing product in the dataBase , then: product is stored", () => {

    //given valid variables
    //when
    const product = new Product({ name, price, unit, stock, description, imagePath })
    //then
    expect(product.getName()).toContain(name)
    expect(product.getPrice()).toBe(price)
    expect(product.getUnit()).toBe(unit)
    expect(product.getDescription()).toContain(description)
    expect(product.getImagePath()).toContain(imagePath)
    expect(product.getStock()).toBe(stock)
    //toBe(strict equality) is used to test numbers while toContain is for iterables (arrays, strings, etc)
})