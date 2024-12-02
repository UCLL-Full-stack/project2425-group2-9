import { Product as productPrisma } from "@prisma/client";

export class Product {
    private name!: string;
    private price!: number;
    private unit!: string;
    private stock!: number;
    private description!: string;
    private imagePath!: string;

    constructor(product: { name: string, price: number, unit: string, stock: number, description: string, imagePath: string }) {
        this.setName(product.name);
        this.setPrice(product.price);
        this.setUnit(product.unit);
        this.setStock(product.stock);
        this.setDescription(product.description);
        this.setImagePath(product.imagePath);
    }

    getName(): string {
        return this.name
    }
    setName(name: string): void {
        this.name = name;
    }

    getPrice(): number {
        return this.price;
    }
    setPrice(price: number): void {
        this.price = price;
    }

    getUnit(): string {
        return this.unit
    }
    setUnit(unit: string): void {
        this.unit = unit;
    }

    getStock(): number {
        return this.stock;
    }
    setStock(stock: number): void {
        this.stock = stock;
    }

    getDescription(): string {
        return this.description
    }
    setDescription(description: string): void {
        this.description = description;
    }

    getImagePath(): string {
        return this.imagePath
    }
    setImagePath(imagePath: string): void {
        this.imagePath = imagePath;
    }


    equal(newProduct: Product) {
        return (
            newProduct.name === this.name &&
            newProduct.price === this.price &&
            newProduct.unit === this.unit &&//the equals method just checks if the data types of each attribute is the same as defined in the constructor            newProduct.stock === this.stock&&
            newProduct.description === this.description &&
            newProduct.imagePath === this.imagePath
        )

    }

    static  from({

        name,
        price,
        unit,
        stock,
        description,
        imagePath
        
    } : productPrisma) {

        return new Product({

            name,
            price,
            unit,
            stock,
            description,
            imagePath
        })
    }
    }

   