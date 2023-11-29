-- Création de la table products
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
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
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP
);

-- Insertion de données par défaut dans la table users
INSERT INTO users (firstname, lastname, email, password, role) VALUES
    ('Admin', '1', 'admin1@example.com', 'passwordadmin', 'admin'),
    ('User', '1', 'user1@example.com', 'passworduser1', 'user'),
    ('User', '2', 'user2@example.com', 'passworduser2', 'user');

