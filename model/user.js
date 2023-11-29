import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("user", {
  firstname: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  lastname: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  token: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
  }
});

export default User;

/* sequelize.sync().then(() => {
  console.log('User table created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
}); */