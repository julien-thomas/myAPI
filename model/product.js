import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Product = sequelize.define("product", {
  name: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: null,
  },
  picture: {
    type: DataTypes.STRING,
    defaultValue: null,
  }
});

export default Product;