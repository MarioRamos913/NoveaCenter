DROP TABLE IF EXISTS licenses;


CREATE DATABASE BD_NovaCenter;
USE BD_NovaCenter;

CREATE TABLE licenses (
    key VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    id_number VARCHAR(50) NOT NULL,
    business_name VARCHAR(150),
    sector VARCHAR(100),
    software VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    expiration_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
