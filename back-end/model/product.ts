import { Product as productPrisma } from "@prisma/client";

export class Product {
    private name: string;
    private price: number;
    private unit: string;
    private stock: number;
    private description: string;
    private imagePath: string;

    constructor(product: { name: string, price: number, unit: string, stock: number, description: string, imagePath: string }) {
        this.validate(product);

        this.name = product.name;
        this.price = product.price;
        this.unit = product.unit;
        this.stock = product.stock;
        this.description = product.description;
        this.imagePath = product.imagePath;
    }

    validate(product: { name: string, price: number, unit: string, stock: number, description: string, imagePath: string }) {
        if (!product.name.trim()) throw new Error("Name is required.");
        if (!product.unit.trim()) throw new Error("Unit is required.");
        if (!product.description.trim()) throw new Error("Description is required.");
        if (!product.imagePath.trim()) throw new Error("Image path is required.");

        if (product.price < 0) throw new Error("Price must be positive.");
        if (product.stock < 0) throw new Error("Stock must be non-negative.");
    }

    getName(): string {
        return this.name
    }

    getPrice(): number {
        return this.price;
    }

    getUnit(): string {
        return this.unit
    }

    getStock(): number {
        return this.stock;
    }

    getDescription(): string {
        return this.description
    }

    getImagePath(): string {
        return this.imagePath
    }

    equal(newProduct: Product) {
        return (
            newProduct.name === this.name &&
            newProduct.price === this.price &&
            newProduct.unit === this.unit && // the equals method just checks if the data types of each attribute is the same as defined in the constructor            newProduct.stock === this.stock&&
            newProduct.description === this.description &&
            newProduct.imagePath === this.imagePath &&
            newProduct.stock === this.stock
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

   