-- Define the database structure (schema)
CREATE DATABASE IF NOT EXISTS userpersonaldetails;
USE userpersonaldetails;

-- Create the Users table
CREATE TABLE IF NOT EXISTS users (
   user_id char(36) PRIMARY KEY,
   user_name VARCHAR(255) NOT NULL,
   user_email VARCHAR(255) UNIQUE NOT NULL,
   user_password VARCHAR(255) NOT NULL,
   user_image VARCHAR(255),
   total_orders INT,
   createdAt DATETIME,
   updatedAt DATETIME,
   last_logged_in DATETIME
);

-- Insert some initial data
INSERT INTO users (user_id, user_name, user_email, user_password, user_image , total_orders, createdAt,updatedAt, last_logged_in)
VALUES
   ('1234-5678-90AB-CDEF', 'admin', 'admin@gmail.com', '$2b$10$Pmi.xzi91Xo0Y6ta2dI0CuipKiR4h.pB2yLlHNLC.Xr5VPP1gt95K', null , null , NOW(), null, null),

   ('5678-90AB-CDEF-1234', 'user', 'user@gmail.com','$2b$10$vKZ76jBnkcbg2jk1sxJXce.ZO/mjV842AWQyLLZWO0DIMTCYI3dFC', '1696530460286.jpg', 2, NOW(), null, null),

   ('ced6ba2a-853c-44cb-a3d8-3ade5dd4d845', 'user2', 'user2@gmail.com','$2b$10$xxesPOgklBzYD0/WFOPhpec5QGDKMfFKsOU.KVdsvQ5NLOOw0Ge.2', '1696577116805.jpg', 4, NOW(), null, null);

-- Admin password is "admin123" it shows in hashed format in the database "$2b$10$Pmi.xzi91Xo0Y6ta2dI0CuipKiR4h.pB2yLlHNLC.Xr5VPP1gt95K" 
-- User password is "user123" it shows in hashed format in the database "$2b$10$vKZ76jBnkcbg2jk1sxJXce.ZO/mjV842AWQyLLZWO0DIMTCYI3dFC" 
-- User2 password is "user23" it shows in hashed format in the database "$2b$10$xxesPOgklBzYD0/WFOPhpec5QGDKMfFKsOU.KVdsvQ5NLOOw0Ge.2" 