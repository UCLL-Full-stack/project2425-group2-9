import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const resourceImagePath: string = "/images/";

const main = async () => {
    // Delete existing records
    await prisma.cartContainsProduct.deleteMany();
    await prisma.product.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.customer.deleteMany();

    const returnAllItemsInCart = async (cartId: string) => {
        return await prisma.cartContainsProduct.findMany({
            where: { cartId: cartId },
            include: { product: true }
        });
    };

    const calculateTotalPrice = async ({ cartId }: { cartId: string }): Promise<number> => {
        try {
            const cartContainsProduct = await returnAllItemsInCart(cartId);
            if (!cartContainsProduct || cartContainsProduct.length === 0) return 0;

            const totalPrice = cartContainsProduct.reduce((finalPrice, product) => {
                const productPrice = product.product?.price;
                return finalPrice + (product.quantity * (productPrice ?? 0));
            }, 0);

            return totalPrice ?? 0;
        } catch (error) {
            console.error("Error in calculateTotalPrice:", error);
            throw new Error('Error calculating total price');
        }
    };

    // Create customers
    const customerRL = await prisma.customer.create({
        data: {
            password: await bcrypt.hash("roland1234", 10),
            username: "@roland",
            firstName: "roland",
            lastName: "sone",
            phone: "046058946",
            role: "ADMIN"
        },
    });

    const customerMT = await prisma.customer.create({
        data: {
            password: await bcrypt.hash("@matej1234", 10),
            username: "@matej",
            firstName: "matej",
            lastName: "vesel",
            phone: "046058947",
            role: "ADMIN"
        }
    });

    const customerRN = await prisma.customer.create({
        data: {
            password: await bcrypt.hash("Rhone_1245+", 10),
            username: "@Rhone",
            firstName: "Rhone",
            lastName: "Abani",
            phone: "046058949",
            role: "CUSTOMER"
        },
    });

    const customer1 = await prisma.customer.create({
        data: {
            password: await bcrypt.hash("Rhone245+", 10),
            username: "@Blessing",
            firstName: "Blessing",
            lastName: "Abani",
            phone: "046058941",
            cart: {
                create: {
                    totalPrice: 0
                }
            },
            role: "GUEST"
        },
    });

    // Create carts for customers
    const cartRL = await prisma.cart.create({
        data: {
            totalPrice: 0,
            customerId: customerRN.id,
        }
    });

    const cartRN = await prisma.cart.create({
        data: {
            totalPrice: 0,
            customerId: customerRL.id,
        }
    });

    const cartMT = await prisma.cart.create({
        data: {
            totalPrice: 0,
            customerId: customerMT.id,
        }
    });

    // Create products
    const productBread = await prisma.product.create({
        data: {
            name: "Bread",
            price: 5,
            unit: "piece",
            stock: 25,
            description: "Rye bread is a type of bread made with various proportions of flour from rye grain. It can be light or dark in color, depending on the type of flour used and the addition of coloring agents, and is typically denser than bread made from wheat flour. Compared to white bread, it is higher in fiber, darker in color, and stronger in flavor. The world's largest exporter of rye bread is Poland.",
            imagePath: `${resourceImagePath}bread.png`
        }
    });

    const productMy = await prisma.product.create({
        data: {
            name: "Mayonnaise",
            price: 7,
            unit: "piece",
            stock: 15,
            description: "Mayonnaise is an emulsion of oil, egg yolk, and an acid, either vinegar or lemon juice;[4] there are many variants using additional flavorings. The color varies from near-white to pale yellow, and its texture from a light cream to a thick gel.",
            imagePath: resourceImagePath + "mayonnaise.png"
        }
    });

    const productLp = await prisma.product.create({
        data: {
            name: "Laptop",
            price: 700,
            unit: "piece",
            stock: 6,
            description: "A laptop computer or notebook computer, also known as a laptop or notebook, is a small, portable personal computer (PC). Laptops typically have a clamshell form factor with a flat-panel screen on the inside of the upper lid and an alphanumeric keyboard and pointing device on the inside of the lower lid.[1][2] Most of the computer's internal hardware is fitted inside the lower lid enclosure under the keyboard, although many modern laptops have a built-in webcam at the top of the screen, and some even feature a touchscreen display. In most cases, unlike tablet computers which run on mobile operating systems, laptops tend to run on desktop operating systems, which were originally developed for desktop computers.",
            imagePath: resourceImagePath + "laptop.png"
        }
    });

    const productMS = await prisma.product.create({
        data: {
            name: "Mouse",
            price: 10,
            unit: "piece",
            stock: 16,
            description: "A computer mouse (plural mice, also mouses)[nb 1] is a hand-held pointing device that detects two-dimensional motion relative to a surface. This motion is typically translated into the motion of the pointer (called a cursor) on a display, which allows a smooth control of the graphical user interface of a computer.",
            imagePath: resourceImagePath + "mouse.png"
        }
    });

    const productBN = await prisma.product.create({
        data: {
            name: "Bananas",
            price: 5,
            unit: "bunch",
            stock: 22,
            description: "A banana is an elongated, edible fruit -- botanically a berry[1] -- produced by several kinds of large herbaceous flowering plants in the genus Musa. In some countries, cooking bananas are called plantains, distinguishing them from dessert bananas. The fruit is variable in size, color and firmness, but is usually elongated and curved, with soft flesh rich in, starch covered with a peel, which may have a variety of colors when ripe. It grows upward in clusters near the top of the plant. Almost all modern edible seedless (parthenocarp) cultivated bananas come from two wild species -- Musa acuminata and Musa balbisiana, or hybrids of them.",
            imagePath: resourceImagePath + "bananas.png",
        }
    });

    const productAP = await prisma.product.create({
        data: {
            name: "Apples",
            price: 4,
            unit: "kg",
            stock: 100,
            description: "An apple is a round, edible fruit produced by an apple tree (Malus spp., among them the domestic or orchard apple; Malus domestica). Apple trees are cultivated worldwide and are the most widely grown species in the genus Malus. The tree originated in Central Asia, where its wild ancestor, Malus sieversii, is still found. Apples have been grown for thousands of years in Eurasia and were introduced to North America by European colonists. Apples have religious and mythological significance in many cultures, including Norse, Greek, and European Christian tradition.",
            imagePath: resourceImagePath + "apples.png"
        }
    });

    const productWT = await prisma.product.create({
        data: {
            name: "Water",
            price: 2,
            unit: "L",
            stock: 250,
            description: "Water is an inorganic compound with the chemical formula H2O. It is a transparent, tasteless, odorless,[c] and nearly colorless chemical substance. It is the main constituent of Earth's hydrosphere and the fluids of all known living organisms (in which it acts as a solvent[20]). It is vital for all known forms of life, despite not providing food energy or organic micronutrients. Its chemical formula, H2O, indicates that each of its molecules contains one oxygen and two hydrogen atoms, connected by covalent bonds. The hydrogen atoms are attached to the oxygen atom at an angle of 104.45°.[21] In liquid form, H2O is also called 'water' at standard temperature and pressure.",
            imagePath: resourceImagePath + "water.png"
        }
    });

    const productSG = await prisma.product.create({
        data: {
            name: "Sugar",
            price: 10,
            unit: "500 g",
            stock: 20,
            description: "Sugar is the generic name for sweet-tasting, soluble carbohydrates, many of which are used in food. Simple sugars, also called monosaccharides, include glucose, fructose, and galactose. Compound sugars, also called disaccharides or double sugars, are molecules made of two bonded monosaccharides; common examples are sucrose (glucose + fructose), lactose (glucose + galactose), and maltose (two molecules of glucose). White sugar is a refined form of sucrose. In the body, compound sugars are hydrolysed into simple sugars.",
            imagePath: resourceImagePath + "sugar.png"
        }
    });

    const productSL = await prisma.product.create({
        data: {
            name: "Salt",
            price: 7,
            unit: "500 g",
            stock: 23,
            description: "In common usage, salt is a mineral composed primarily of sodium chloride (NaCl). When used in food, especially in granulated form, it is more formally called table salt. In the form of a natural crystalline mineral, salt is also known as rock salt or halite. Salt is essential for life in general (being the source of the essential dietary minerals sodium and chlorine), and saltiness is one of the basic human tastes. Salt is one of the oldest and most ubiquitous food seasonings, and is known to uniformly improve the taste perception of food, including otherwise unpalatable food.[1] Salting, brining, and pickling are also ancient and important methods of food preservation.",
            imagePath: resourceImagePath + "salt.png"
        }
    });

    // Function to add products to cart and update total price
    const addProductToCart = async (cartId: string, productName: string, quantity: number) => {
        await prisma.cartContainsProduct.create({
            data: {
                quantity,
                cart: {
                    connect: { id: cartId }
                },
                product: {
                    connect: { name: productName }
                }
            }
        });

        const totalPrice = await calculateTotalPrice({ cartId });
        await prisma.cart.update({
            where: { id: cartId },
            data: { totalPrice }
        });
    };

    // Add products to carts
    await addProductToCart(cartRL.id, productAP.name, 2);
    await addProductToCart(cartRN.id, productAP.name, 4);
    await addProductToCart(cartRL.id, productLp.name, 2);
    await addProductToCart(cartRL.id, productMS.name, 2);
    await addProductToCart(cartRL.id, productMy.name, 2);
    await addProductToCart(cartRN.id, productMy.name, 2);
    await addProductToCart(cartMT.id, productMy.name, 2);
};

(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();