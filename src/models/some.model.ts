import mongoose, { Schema } from "mongoose";
import config from "../config";

function createCollection(name: string, definition: object) {
  const schema = new Schema(definition);
  const model = mongoose.model(name, schema);

  return { schema, model };
}

/*
 * PUNTO 1
 */

// Roles de usuario. Cliente, Domiciliarion, Administrador, etc...
const { schema: UserRoleSchema, model: UserRole } = createCollection(
  "UserRole",
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
    },
  },
);

// Usuario.
const { schema: UserSchema, model: User } = createCollection("User", {
  name: {
    type: String,
    required: true,
    minLength: 2,
  },

  lastName: {
    type: String,
    required: true,
    minLength: 2,
  },

  // Rol del usuario
  roleId: {
    type: mongoose.Types.ObjectId, // id del rol en el schema de UserRolaSchema
    required: true,
  },

  profileImage: {
    type: String, // url
    default: "", // url de foto predeterminada
    validate: () => {
      // validar que la url sea valida
      return true;
    },
  },

  phone: { // con indicativo de pais
    type: Number,
    required: true,
    unique: true,
    max: 99_999_999_999_999, // hay indicativos de 4 digitos
    min: 10_000_000_000,
    get: (value: number) => { // agrega + al comienzo
      return "+" + value;
    },
  },

  email: {
    type: String,
    required: true,
    match: /^[^.\s][\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/gm, // regex email
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minLength: 12,
    maxLength: 24,
    validation: () => {
      // validacion de caracteres especiales, minusculas, mayusculas, numeros
      return true;
    },
  },

  birthday: {
    type: Date,
    required: true,
    immutable: true,
    min: new Date(),
  },

  // Datos de domiliciliario propio. Este campo siempre es nulo a no ser que el usuario sea un domiciliario
  // propio de un restaurante.
  deliveryData: {
    type: new Schema({
      // Costo de envío
      cost: {
        type: Number,
        required: true,
        min: 0,
      },
      // Id del restaurante al cual pertenece el domiciliario.
      restaurantId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
    }),
    required: false,
  },
});

// Una de las posibles ubicaciones de un restaurante.
const { schema: LocationSchema, model: Location } = createCollection(
  "Location",
  {
    // Nombre de la sucursal
    name: {
      type: String,
      required: true,
      minLength: 2,
    },

    // Dirección
    address: {
      type: String,
      required: true,
      minLength: 2,
    },

    // Rango máximo de servicio en Km
    maxServiceRange: {
      type: Number,
      required: true,
      min: 0,
    },

    // Restaurante al cual pertenece
    restaurantId: {
      type: mongoose.Types.ObjectId, // Referencia a RestaurantSchema
      required: true,
    },
  },
);

// Categorías de productos de menu de los restaurantes
const { schema: MenuItemCategorySchema, model: MenuItemCategory } =
  createCollection("MenuItemCategory", {
    name: {
      type: String,
      required: true,
      minLength: 2,
    },
  });

// Productos de los menus de los restaurantes
const { schema: MenuItemSchema, model: MenuItem } = createCollection(
  "MenuItem",
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
    },

    description: {
      type: String,
      required: true,
      minLength: 2,
    },

    image: {
      type: String, // url
      default: "", // url de foto predeterminada
      validate: () => {
        // validar que la url sea valida
        return true;
      },
    },

    // Categoría del producto
    categoryId: {
      type: mongoose.Types.ObjectId, // Referencia a MenuItemCategorySchema
      required: true,
    },

    // Restaurante al cual pertenece el producto
    restaurantId: {
      type: mongoose.Types.ObjectId, // Referencia a RestaurantSchema
      required: true,
    },
  },
);

// Categorías de restaurantes
const { schema: RestaurantCategorySchema, model: RestaurantCategory } =
  createCollection("RestaurantCategory", {
    name: {
      type: String,
      required: true,
      minLength: 2,
    },
  });

// Restaurantes
const { schema: RestaurantSchema, model: Restaurant } = createCollection(
  "Restaurant",
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
    },

    // Usuario administrador del restaurante
    administratorId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },

    // Categoría a la cual pertence el restaurante
    categoryId: {
      type: mongoose.Types.ObjectId, // Referencia a RestaurantCategorySchema
      required: true,
    },

    // Tiempo de entrega esperado del restaurante
    deliveryTime: {
      type: Number,
      required: true,
      min: 0,
    },

    // Calificación promedio de todas las ventas del restaurante
    rating: {
      type: Number,
      required: true,
      min: 0,
    },
  },
);

/*
 * PUNTO 2
 */

// Estados de un pedido
const { schema: OrderStateSchema, model: OrderState } = createCollection(
  "OrderState",
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
    },
  },
);

// Pedido de un producto. Incluye una referencia al producto,
// una referencia al pedido al cual pertenece y la cantidad.
const { schema: OrderMenuItemSchema, model: OrderMenuItem } = createCollection(
  "OrderMenuItem",
  {
    // El producto que se está pidiendo
    itemId: {
      type: mongoose.Types.ObjectId, // Referencia a MenuItemSchema
      required: true,
    },

    // El pedido
    orderId: {
      type: mongoose.Types.ObjectId, // Referencia a OrderSchema
      required: true,
    },

    // Cantidad del producto que se pidió
    quantity: {
      type: Number,
      required: true,
    },
  },
);

// Pedidos
const { schema: OrderSchema, model: Order } = createCollection("Order", {
  name: {
    type: String,
    required: true,
    minLength: 2,
  },

  // Tiempo esperado de entrega
  deliveryTime: {
    type: Date,
    required: true,
  },

  // Calificación del usuario a la orden. Es nula hasta que el pedido llegue a la etapa de entregado
  orderRating: {
    type: Number,
    min: 0,
  },

  // El restaurante al cual se realizó la orden
  restaurantId: {
    type: mongoose.Types.ObjectId, // Referencia a RestaurantSchema
    required: true,
  },

  // El usuario que realizó el pedido
  userId: {
    type: mongoose.Types.ObjectId, // Referencia a UserSchema
    required: true,
  },
});

const role = new UserRole({ name: "Usuario" });
const user = new User({
  name: "Usuario",
  lastName: "Primero",
  roleId: role._id,
  phone: Math.floor(Math.random() * (99_999_999_999_999 - 10_000_000_000)),
  email: "user@email.com",
  password: "sadjfhajsghajskg",
  birthday: new Date(),
});
const itemCategory = new MenuItemCategory({ name: "Cat 1" });
const restaurantCategory = new RestaurantCategory({ name: "Cat 1" });
const restaurant = new Restaurant({
  name: "Restaurante",
  administratorId: user._id,
  categoryId: restaurantCategory._id,
  deliveryTime: 123,
  rating: 5,
});
const item = new MenuItem({
  name: "Item 1",
  description: "An item",
  image: "",
  categoryId: itemCategory._id,
  restaurantId: restaurant._id,
});
const location = new Location({
  name: "Ubicación 1",
  address: "askfaflk",
  maxServiceRange: 12,
  restaurantId: restaurant._id,
});
const order = new Order({
  name: "Order",
  deliveryTime: 12,
  orderRating: 5,
  restaurantId: restaurant._id,
  userId: user._id,
});
const menuItem = new OrderMenuItem({
  itemId: item._id,
  orderId: order._id,
  quantity: 3,
});

const main = async () => {
  await config.db.connect();
  role.save();
  user.save();
  itemCategory.save();
  restaurantCategory.save();
  restaurant.save();
  item.save();
  location.save();
  order.save();
  menuItem.save();
};
