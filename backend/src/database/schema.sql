CREATE DATABASE todo_app;
USE todo_app;

-- Table tasks
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table users 
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1. Créer l'utilisateur avec mot de passe simple
CREATE USER 'nodeuser'@'localhost' IDENTIFIED BY '1234';

-- 2. Donner tous les droits sur la base
GRANT ALL PRIVILEGES ON todo_app.* TO 'nodeuser'@'localhost';

-- 3. Appliquer les privilèges
FLUSH PRIVILEGES;
