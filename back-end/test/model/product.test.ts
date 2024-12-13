import { Product } from "../../model/product";

const name = "I-phone 16 pro max";
const price = 1200;
const unit = "Euros";
const stock = 200;
const description = "The iPhone 16 Pro Max features a stunning 6.9-inch Super Retina XDR display with a resolution of 2868x1320 pixels, delivering vibrant colors and sharp details. Encased in a durable titanium design, it offers exceptional durability and a sleek look.";
const imagePath = "C:/Users/HOME/OneDrive/Desktop/UCLL/FULLSTACK/project2425-group2-9/back-end/images/apple_iphone-16-pro-max-256-brz_7726759_1.jpg";

test("Given valid values; When creating product; Then product is created with those values.", () => {
    // GIVEN
    // Values at the top of this file.

    // WHEN
    const product = new Product({ name, price, unit, stock, description, imagePath });

    // THEN
    expect(product.getName()).toEqual(name);
    expect(product.getPrice()).toBe(price);
    expect(product.getUnit()).toBe(unit);
    expect(product.getStock()).toBe(stock);
    expect(product.getDescription()).toEqual(description);
    expect(product.getImagePath()).toEqual(imagePath);
});

test("Given no product name; When creating product; Then error is thrown.", () => {
    // GIVEN
    // Values at the top of this file.

    // WHEN
    const createProduct = () => new Product({ name: "", price, unit, stock, description, imagePath });

    // THEN
    expect(createProduct).toThrow("Name is required.");
});

test("Given non-positive price; When creating product; Then error is thrown.", () => {
    // GIVEN
    // Values at the top of this file.

    // WHEN
    const createProduct = () => new Product({ name, price: -1, unit, stock, description, imagePath });

    // THEN
    expect(createProduct).toThrow("Price must be positive.");
});

test("Given no unit; When creating product; Then error is thrown.", () => {
    // GIVEN
    // Values at the top of this file.

    // WHEN
    const createProduct = () => new Product({ name, price, unit: "", stock, description, imagePath });

    // THEN
    expect(createProduct).toThrow("Unit is required.");
});

test("Given negative stock; When creating product; Then error is thrown.", () => {
    // GIVEN
    // Values at the top of this file.

    // WHEN
    const createProduct = () => new Product({ name, price, unit, stock: -1, description, imagePath });

    // THEN
    expect(createProduct).toThrow("Stock must be non-negative.");
});

test("Given no description; When creating product; Then error is thrown.", () => {
    // GIVEN
    // Values at the top of this file.

    // WHEN
    const createProduct = () => new Product({ name, price, unit, stock, description: "", imagePath });

    // THEN
    expect(createProduct).toThrow("Description is required.");
});

test("Given no image path; When creating product; Then error is thrown.", () => {
    // GIVEN
    // Values at the top of this file.

    // WHEN
    const createProduct = () => new Product({ name, price, unit, stock, description, imagePath: "" });

    // THEN
    expect(createProduct).toThrow("Image path is required.");
});

test("Given valid values; When comparing two products; Then they are equal.", () => {
    // GIVEN
    const product1 = new Product({ name, price, unit, stock, description, imagePath });
    const product2 = new Product({ name, price, unit, stock, description, imagePath });

    // WHEN
    const isEqual = product1.equal(product2);

    // THEN
    expect(isEqual).toBe(true);
});

test("Given different values; When comparing two products; Then they are not equal.", () => {
    // GIVEN
    const product1 = new Product({ name, price, unit, stock, description, imagePath });
    const differentProduct = new Product({ name: "Different Product", price, unit, stock, description, imagePath });

    // WHEN
    const isEqual = product1.equal(differentProduct);

    // THEN
    expect(isEqual).toBe(false);
});

test("Given valid values; When setting new price; Then price is updated.", () => {
    // GIVEN
     // WHEN
    const product = new Product({ name, price :1500, unit, stock, description, imagePath });

    // THEN
    expect(product.getPrice()).toBe(1500);
});

test("Given valid values; When setting new stock; Then stock is updated.", () => {
    // GIVEN
    // WHEN
    const product = new Product({ name, price, unit, stock:20, description, imagePath });
    // THEN
    expect(product.getStock()).toBe(20);
});

