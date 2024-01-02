import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcryptjs from "bcryptjs";
import("./config/database.js").sequalize;
import express from "express";
import bodyParser from "body-parser";
const { MYSQL_URI, API_PORT, TOKEN_KEY } = process.env;
const app = express();
app.use(bodyParser.json());
import User from "./model/user.js";
import Product from "./model/product.js";
import Address from "./model/address.js";
import verifyToken from "./middleware/auth.js";
import isAdmin from "./middleware/admin.js";
app.use(cors())

/* *****************************************************************
USERS
***************************************************************** */

// register
app.post("/users", async (req, res) => {
  try {
    // get user input
    const { firstname, lastname, email, password } = req.body;

    // user input validation
    if (!(firstname && lastname && email && password)) {
      res.status(400).send("All inputs are required");
    }

    // check if user already exists
    const oldUser = await User.findOne({ where: { email: req.body.email } });

    if (oldUser) {
      return res.status(409).send("User already exists. Please login");
    }

    // encrypt user password
    const encryptedPassword = await bcryptjs.hash(password, 10);

    // create user in the database
    const user = await User.create({
      firstname: firstname,
      lastname: lastname,
      email: email.toLowerCase(),
      password: encryptedPassword
    });

    // create token
    const token = jwt.sign(
      { sub: user.id, role: user.role, email: user.email },
      TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    // save user token
    user.token = token;
    await user.save();

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
})

// login
app.post("/login", async (req, res) => {
  try {
    // get user input
    const { email, password } = req.body;

    // validate user input
    if (!(email && password)) {
      res.status(400).send("All inputs are required");
    }

    // check if user exist in the database
    const user = await User.findOne({ where: { email: req.body.email } });

    if (user && (await bcryptjs.compare(password, user.password))) {
      // create token
      const token = jwt.sign(
        { sub: user.id, role: user.role, email: user.email },
        TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;
      await user.save();
      // return user
      res.status(200).json(user);
    } else {
      res.status(400).send("identifiant ou mot de passe incorrect");
    }

  } catch (err) {
    console.log(err);
  }
})

app.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);

  } catch (err) {
    console.log(err);
  }
})

app.get("/users/:id", verifyToken, async (req, res) => {
  try {
    // get request user
    const currentUser = req.user;
    // parsing id for comparison
    const id = parseInt(req.params.id);
    // only allow admins to access other user records or the user himself
    if ((currentUser.role != 'admin') && (currentUser.sub != id)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await User.findOne({ where: { id: id } });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
})

app.put("/users/:id", verifyToken, async (req, res) => {
  try {
    const currentUser = req.user;
    const id = parseInt(req.params.id);
    if ((currentUser.role != 'admin') && (currentUser.sub != id)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { firstname, lastname, email, password } = req.body;

    // check if email already exists
    const oldUser = await User.findOne({ where: { email: req.body.email } });

    if (oldUser) {
      if (oldUser.id != id) {
        return res.status(409).send("Email already exists.");
      }
    }

    const encryptedPassword = await bcryptjs.hash(password, 10);
    await User.update(
      {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: encryptedPassword
      },
      {
        where: { id: id }
      }
    );
    const user = await User.findOne({ where: { id: id } });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
})



app.delete("/users/:id", verifyToken, async (req, res) => {
  try {
    const currentUser = req.user;
    const id = parseInt(req.params.id);
    if ((currentUser.role != 'admin') && (currentUser.sub != id)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    await User.destroy({ where: { id: id } });
    res.status(200).send(`user ${id} deleted`);
  } catch (err) {
    console.log(err);
  }
})



app.post("/welcome", verifyToken, (req, res) => {
  res.status(200).send("Welcome");
});

app.get("/", (req, res) => {
  res.send('Successful response.');
});

/* *****************************************************************
PRODUCTS
***************************************************************** */

// create products
app.post("/products", isAdmin, async (req, res) => {
  try {
    // get product input
    const { name, picture, description, price } = req.body;

    // product input validation
    if (!(name && price)) {
      res.status(400).send("All inputs are required");
    }

    // create product in the database
    const product = await Product.create({
      name: name,
      picture: picture,
      description: description,
      price: price
    });

    // return new product
    res.status(201).json(product);
  } catch (err) {
    console.log(err);
  }
})

app.get("/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
  }
})

app.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await Product.findOne({ where: { id: id } });
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
})

app.put("/products/:id", isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, picture, description, price } = req.body;
    await Product.update({ name: name, picture: picture, description: description, price: price }, {
      where: { id: id }
    });
    const product = await Product.findOne({ where: { id: id } });
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
})

app.delete("/products/:id", isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await Product.destroy({ where: { id: id } });
    res.status(200).send(`product ${id} deleted`);
  } catch (err) {
    console.log(err);
  }
})

/* *****************************************************************
ADDRESSES
***************************************************************** */

// create address
app.post("/address/:id", verifyToken, async (req, res) => {
  try {
    const currentUser = req.user;
    const id = parseInt(req.params.id);
    if ((currentUser.role != 'admin') && (currentUser.sub != id)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // get address input
    const { road, postalCode, city, country } = req.body;

    // address input validation
    if (!(road && postalCode && city && country)) {
      res.status(400).send("All inputs are required");
    }

    // create address in the database
    const address = await Address.create({
      road: road,
      postalCode: postalCode,
      city: city,
      country: country,
      user_id: id
    });

    // return new address
    res.status(201).json(address);
  } catch (err) {
    console.log(err);
  }
})

app.get("/address/:id", verifyToken, async (req, res) => {
  try {
    const currentUser = req.user;
    const id = parseInt(req.params.id);
    if ((currentUser.role != 'admin') && (currentUser.sub != id)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const address = await Address.findOne({ where: { user_id: id } });
    res.status(200).json(address);
  } catch (err) {
    console.log(err);
  }
})

app.put("/address/:id", verifyToken, async (req, res) => {
  try {
    const currentUser = req.user;
    const id = parseInt(req.params.id);
    if ((currentUser.role != 'admin') && (currentUser.sub != id)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { road, postalCode, city, country } = req.body;
    await Address.update({ road: road, postalCode: postalCode, city: city, country: country }, {
      where: { user_id: id }
    });
    const address = await Address.findOne({ where: { user_id: id } });
    res.status(200).json(address);
  } catch (err) {
    console.log(err);
  }
})

app.delete("/address/:id", verifyToken, async (req, res) => {
  try {
    const currentUser = req.user;
    const id = parseInt(req.params.id);
    if ((currentUser.role != 'admin') && (currentUser.sub != id)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    await Address.destroy({ where: { user_id: id } });
    res.status(200).send(`address deleted`);
  } catch (err) {
    console.log(err);
  }
})

// port 3000 listener 
app.listen(API_PORT, () => {
  console.log(`Application myAPI à l'écoute à l'adresse https://${MYSQL_URI}:${API_PORT}/!`);
});