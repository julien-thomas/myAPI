-- Création de la table products
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    picture VARCHAR(255),
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP
);

-- Insertion de données par défaut dans la table product
INSERT INTO products (name, description, price) VALUES
    ('Produit 1', 'Description du produit 1', 20.99),
    ('Produit 2', 'Description du produit 1', 34.99);
    ('Produit 3', 'Description du produit 1', 42.42);

-- Création de la table users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(255),
    role VARCHAR(255) NOT NULL DEFAULT 'user',
    address_id INT CONSTRAINT `users_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP
);

-- Insertion de données par défaut dans la table users
INSERT INTO users (firstname, lastname, email, password, role) VALUES
    ('Admin', '1', 'admin1@example.com', 'passwordadmin', 'admin'),
    ('User', '1', 'user1@example.com', 'passworduser1', 'user'),
    ('User', '2', 'user2@example.com', 'passworduser2', 'user');

-- Création de la table addresses
CREATE TABLE addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    road VARCHAR(255) NOT NULL,
    postalCode VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP
);

-- TO DELETE --

CREATE TABLE addresses (id INT PRIMARY KEY AUTO_INCREMENT, road VARCHAR(255) NOT NULL, postalCode VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL, country VARCHAR(255) NOT NULL, createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP);

ALTER TABLE users ADD address_id INT; 

ALTER TABLE `users` ADD KEY `address_id` (`address_id`);

ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE addresses ADD user_id INT;

ALTER TABLE products ADD picture VARCHAR(255);