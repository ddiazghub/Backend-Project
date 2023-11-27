import { generateSecret } from "node-2fa";
import { EnumMap, IDoc } from "../models/model";
import { IBaseUser, IUser, MfaSecret } from "../models/user.model";
import config from "../config";
import argon2 from "argon2";
import { IRestaurant } from "../models/restaurant.model";
import { IOrderProduct } from "../models/order.model";
import { IProduct } from "../models/product.model";

export interface TestUser extends IBaseUser {
  role: string;
  mfaSecret?: MfaSecret;
}

export interface TestRestaurant {
  name: string;
  disabled: boolean;
  administrator: string;
  category: string;
  deliveryTime: number;
}

export interface TestRestaurant {
  name: string;
  disabled: boolean;
  administrator: string;
  category: string;
  deliveryTime: number;
}

export interface TestProduct {
  name: string;
  description: string;
  image: string;
  category: string;
  restaurant: string;
  cost: number;
  disabled: boolean;
}

export interface TestOrderProduct {
  product: string;
  quantity: number;
}

export interface TestOrder {
  createdAt?: Date;
  updatedAt?: Date;
  deliveryTime: Date;
  orderRating?: number;
  products: TestOrderProduct[];
  disabled: boolean;
  restaurant: string;
  user: string;
  state: string;
}

export async function getInitialUsers(roles: EnumMap): Promise<TestUser[]> {
  return [
    {
      name: "admin",
      lastName: "admin",
      email: "admin@email.com",
      phone: 10000000001,
      birthday: new Date("December 17, 1995 03:24:00"),
      role: roles["administrador"],
      passwordHash: await argon2.hash("admin"),
      disabled: false,
      mfaSecret: generateSecret({
        name: config.APP_NAME,
        account: "admin@email.com",
      }) as MfaSecret,
    },
    {
      name: "admin2",
      lastName: "admin2",
      email: "admin2@email.com",
      phone: 10000000002,
      birthday: new Date("December 17, 2000 03:24:00"),
      role: roles["administrador"],
      passwordHash: await argon2.hash("admin"),
      disabled: false,
      mfaSecret: generateSecret({
        name: config.APP_NAME,
        account: "admin2@email.com",
      }) as MfaSecret,
    },
    {
      name: "user",
      lastName: "user",
      email: "user@email.com",
      phone: 10000000003,
      birthday: new Date("December 1, 2008 03:24:00"),
      role: roles["usuario"],
      passwordHash: await argon2.hash("123456"),
      disabled: false,
    },
    {
      name: "user2",
      lastName: "usuario",
      email: "usuario@email.com",
      phone: 10000000004,
      birthday: new Date("December 1, 1980 03:24:00"),
      role: roles["usuario"],
      passwordHash: await argon2.hash("123456"),
      disabled: false,
    },
  ];
}

export async function getInitialRestaurants(
  categories: EnumMap,
  users: IDoc<IUser>[],
): Promise<TestRestaurant[]> {
  const getUserByEmail = (email: string) => {
    return users.find((user) => user.email.toString().startsWith(email));
  };

  const admin1 = getUserByEmail("admin@")?._id as unknown as string;
  const admin2 = getUserByEmail("admin2")?._id as unknown as string;

  return [
    {
      name: "Mc Donalds",
      category: categories["comida rapida"],
      disabled: false,
      administrator: admin1,
      deliveryTime: 20,
    },
    {
      name: "Burger king",
      category: categories["comida rapida"],
      disabled: false,
      administrator: admin2,
      deliveryTime: 25,
    },
    {
      name: "Salvator's pizza",
      category: categories["italiano"],
      disabled: false,
      administrator: admin1,
      deliveryTime: 30,
    },
    {
      name: "Teriyaki",
      category: categories["asiatico"],
      disabled: false,
      administrator: admin2,
      deliveryTime: 40,
    },
  ];
}

export async function getInitialProducts(
  categories: EnumMap,
  restaurants: IDoc<IRestaurant>[],
): Promise<TestProduct[]> {
  const getRestaurantByName = (name: string) => {
    return restaurants.find((restaurant) => restaurant.name.startsWith(name));
  };

  const mcDonalds = getRestaurantByName("M")?._id as unknown as string;
  const burgerKing = getRestaurantByName("B")?._id as unknown as string;
  const salvators = getRestaurantByName("S")?._id as unknown as string;
  const teriyaki = getRestaurantByName("T")?._id as unknown as string;

  return [
    {
      name: "Big mac",
      description: "Hamburguesa big mac",
      image:
        "https://th.bing.com/th?id=OSK.HEROiv18AqzbVUKGE9z_FFn6TB4-q2aGWSKp13NRqpCPL34&w=472&h=280&c=1&rs=2&o=6&dpr=1.3&pid=SANGAM",
      restaurant: mcDonalds,
      category: categories["hamburguesas"],
      cost: 20000,
      disabled: false,
    },
    {
      name: "Papas fritas",
      description: "Papas fritas tamaño pequeño",
      image:
        "https://th.bing.com/th/id/R.a4680cb8eaecd6c2baab4fea4a9565f5?rik=X93e4EgI03bJQA&pid=ImgRaw&r=0",
      restaurant: mcDonalds,
      category: categories["comida rapida"],
      cost: 8000,
      disabled: false,
    },
    {
      name: "Whooper",
      description: "Hamburguesa whooper",
      image:
        "https://th.bing.com/th/id/R.f51107d909edbb70b74e11b261cd31af?rik=FZ%2fAfvXXJP2eLg&pid=ImgRaw&r=0",
      restaurant: burgerKing,
      category: categories["hamburguesas"],
      cost: 25000,
      disabled: false,
    },
    {
      name: "Papas porcion",
      description: "Papas fritas tamaño pequeño",
      image:
        "https://th.bing.com/th/id/R.47cbf1240d359cb098908daabf449497?rik=FTRfNBanzT9x7g&pid=ImgRaw&r=0",
      restaurant: burgerKing,
      category: categories["comida rapida"],
      cost: 10000,
      disabled: false,
    },
    {
      name: "Pizza pepperoni",
      description: "Pizza pepperoni personal",
      image:
        "https://th.bing.com/th/id/R.1c0bbc97d4e826668dbd4558aa60ded8?rik=2eOxwVH%2f4zqh2Q&pid=ImgRaw&r=0",
      restaurant: salvators,
      category: categories["pizzas"],
      cost: 25000,
      disabled: false,
    },
    {
      name: "Sushi",
      description: "Sushi california roll",
      image:
        "https://th.bing.com/th/id/R.9a3e4ee286f3aa405acfd7e23b95d58b?rik=7CAFpgrIHWbqQg&riu=http%3a%2f%2fangsarap.files.wordpress.com%2f2011%2f09%2fcalifornia-roll-1.jpg&ehk=y7Fl%2b8zwcsPM9NhZwax1XuusRVz9maZE1FgYz%2fMDNto%3d&risl=&pid=ImgRaw&r=0",
      restaurant: teriyaki,
      category: categories["sushi"],
      cost: 30000,
      disabled: false,
    },
  ];
}

export async function getInitialOrders(
  states: EnumMap,
  users: IDoc<IUser>[],
  restaurants: IDoc<IRestaurant>[],
  products: IDoc<IProduct>[],
): Promise<TestOrder[]> {
  const getUserByEmail = (email: string) => {
    return users.find((user) => user.email.toString().startsWith(email));
  };

  const getRestaurantByName = (name: string) => {
    return restaurants.find((restaurant) => restaurant.name.startsWith(name));
  };

  const getProductByName = (name: string) => {
    return products.find((product) => product.name.startsWith(name));
  };

  const mcDonalds = getRestaurantByName("M")?._id as unknown as string;
  const burgerKing = getRestaurantByName("B")?._id as unknown as string;
  const salvators = getRestaurantByName("S")?._id as unknown as string;
  const teriyaki = getRestaurantByName("T")?._id as unknown as string;

  const user1 = getUserByEmail("user")?._id as unknown as string;
  const user2 = getUserByEmail("usuario")?._id as unknown as string;

  const bigMac = getProductByName("Big")?._id as unknown as string;
  const mcFries = getProductByName("Papas fritas")?._id as unknown as string;
  const whooper = getProductByName("Whooper")?._id as unknown as string;
  const bkFries = getProductByName("Papas porcion")?._id as unknown as string;
  const pizza = getProductByName("Pizza")?._id as unknown as string;
  const sushi = getProductByName("Sushi")?._id as unknown as string;

  return [
    {
      createdAt: new Date("December 1, 2022 03:24:00"),
      updatedAt: new Date("December 1, 2022 03:24:00"),
      deliveryTime: new Date("December 1, 2022 04:00:00"),
      orderRating: 4.6,
      products: [
        {
          product: bigMac,
          quantity: 2,
        },
        {
          product: mcFries,
          quantity: 4,
        },
      ],
      disabled: false,
      restaurant: mcDonalds,
      user: user1,
      state: states["entregado"],
    },
    {
      createdAt: new Date("November 1, 2023 03:24:00"),
      updatedAt: new Date("November 1, 2023 03:24:00"),
      deliveryTime: new Date("November 2, 2023 04:00:00"),
      orderRating: 4.5,
      products: [
        {
          product: whooper,
          quantity: 1,
        },
        {
          product: bkFries,
          quantity: 1,
        },
      ],
      disabled: false,
      restaurant: burgerKing,
      user: user1,
      state: states["entregado"],
    },
    {
      createdAt: new Date("November 26, 2023 03:24:00"),
      updatedAt: new Date("November 26, 2023 03:24:00"),
      deliveryTime: new Date("November 26, 2023 05:00:00"),
      products: [
        {
          product: whooper,
          quantity: 5,
        },
        {
          product: bkFries,
          quantity: 7,
        },
      ],
      disabled: false,
      restaurant: burgerKing,
      user: user2,
      state: states["creado"],
    },
    {
      createdAt: new Date("November 24, 2023 03:24:00"),
      updatedAt: new Date("November 24, 2023 03:24:00"),
      deliveryTime: new Date("November 24, 2023 05:00:00"),
      orderRating: 4.4,
      products: [
        {
          product: pizza,
          quantity: 2,
        }
      ],
      disabled: false,
      restaurant: salvators,
      user: user2,
      state: states["entregado"],
    },
    {
      createdAt: new Date("November 20, 2023 03:24:00"),
      updatedAt: new Date("November 20, 2023 03:24:00"),
      deliveryTime: new Date("November 20, 2023 05:00:00"),
      orderRating: 4.8,
      products: [
        {
          product: sushi,
          quantity: 4,
        }
      ],
      disabled: false,
      restaurant: teriyaki,
      user: user1,
      state: states["entregado"],
    },
    {
      createdAt: new Date("July 20, 2023 03:24:00"),
      updatedAt: new Date("July 20, 2023 03:24:00"),
      deliveryTime: new Date("July 20, 2023 05:00:00"),
      orderRating: 4.7,
      products: [
        {
          product: whooper,
          quantity: 4,
        }
      ],
      disabled: false,
      restaurant: burgerKing,
      user: user1,
      state: states["entregado"],
    },
  ];
}
