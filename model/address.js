import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Address = sequelize.define("address", {
  road: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  postalCode: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  city: {
    type: DataTypes.STRING,
    unique: true,
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  user_id: {
    type: DataTypes.NUMBER,
    defaultValue: null,
  }
});

export default Address;

/* sequelize.sync().then(() => {
  console.log('Address table created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
}); */