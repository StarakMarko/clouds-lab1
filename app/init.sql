CREATE TABLE IF NOT EXISTS parks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    length_of_bicycle_path DECIMAL(10,2),
    price DECIMAL(10,2)
);