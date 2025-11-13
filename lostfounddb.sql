-- Create Database
DROP DATABASE IF EXISTS lostfounddb;
CREATE DATABASE lostfounddb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lostfounddb;

-- Create Table: user
CREATE TABLE user (
    User_ID INT NOT NULL AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role ENUM('User', 'Admin') NOT NULL DEFAULT 'User',
    Contact VARCHAR(50),
    PRIMARY KEY (User_ID),
    UNIQUE KEY uk_email (Email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Table: admin
CREATE TABLE admin (
    Admin_ID INT NOT NULL AUTO_INCREMENT,
    User_ID INT NOT NULL,
    Admin_Role ENUM('SuperAdmin', 'Moderator') NOT NULL DEFAULT 'SuperAdmin',
    PRIMARY KEY (Admin_ID),
    UNIQUE KEY uk_user_id (User_ID),
    FOREIGN KEY (User_ID) REFERENCES user(User_ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Table: item
CREATE TABLE item (
    Item_ID INT NOT NULL AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Category VARCHAR(100),
    User_ID INT NOT NULL,
    Status ENUM('Lost', 'Found') NOT NULL,
    Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Item_ID),
    FOREIGN KEY (User_ID) REFERENCES user(User_ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Table: reports
CREATE TABLE reports (
    Report_ID INT NOT NULL AUTO_INCREMENT,
    User_ID INT NOT NULL,
    Item_ID INT NOT NULL,
    Report_Type ENUM('Lost', 'Found') NOT NULL,
    Report_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Report_ID),
    FOREIGN KEY (User_ID) REFERENCES user(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Item_ID) REFERENCES item(Item_ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Table: lost_item
CREATE TABLE lost_item (
    Lost_Item_ID INT NOT NULL AUTO_INCREMENT,
    Item_ID INT NOT NULL,
    Last_Seen_Location VARCHAR(255),
    Last_Seen_Date DATE,
    Additional_Details TEXT,
    image_path VARCHAR(255),
    PRIMARY KEY (Lost_Item_ID),
    UNIQUE KEY uk_item_id (Item_ID),
    FOREIGN KEY (Item_ID) REFERENCES item(Item_ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Table: found_item
CREATE TABLE found_item (
    Found_Item_ID INT NOT NULL AUTO_INCREMENT,
    Item_ID INT NOT NULL,
    Found_Location VARCHAR(255),
    Found_Date DATE,
    Storage_Location VARCHAR(255),
    Additional_Details TEXT,
    image_path VARCHAR(255),
    PRIMARY KEY (Found_Item_ID),
    UNIQUE KEY uk_item_id (Item_ID),
    FOREIGN KEY (Item_ID) REFERENCES item(Item_ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Users (1 Admin, 9 Normal Users)
INSERT INTO user (User_ID, Name, Email, Password, Role, Contact)
VALUES
    (1, 'Javvy', 'javvy@gmail.com', 'javvy123', 'Admin', '9999999999'),
    (2, 'Sneha Verma', 'sneha.verma@gmail.com', 'password123', 'User', '9765432109'),
    (3, 'Rahul Nair', 'rahul.nair@gmail.com', 'password123', 'User', '9723456780'),
    (4, 'Ananya Das', 'ananya.das@gmail.com', 'password123', 'User', '9745678901'),
    (5, 'Vikram Reddy', 'vikram.reddy@gmail.com', 'password123', 'User', '9790123456'),
    (6, 'Pooja Iyer', 'pooja.iyer@gmail.com', 'password123', 'User', '9701234567'),
    (7, 'Aarav Sharma', 'aarav.sharma@gmail.com', 'password123', 'User', '9876543210'),
    (8, 'Neha Patel', 'neha.patel@gmail.com', 'password123', 'User', '9823456789'),
    (9, 'Rohan Singh', 'rohan.singh@gmail.com', 'password123', 'User', '9812345678'),
    (10, 'Priya Mehta', 'priya.mehta@gmail.com', 'password123', 'User', '9890123456');

-- Insert Single Admin (Linked to Javvy)
INSERT INTO admin (Admin_ID, User_ID, Admin_Role)
VALUES
    (NULL, 1, 'SuperAdmin');

-- Insert Items (Sample 4 Lost, 4 Found)
INSERT INTO item (Item_ID, Name, Description, Category, User_ID, Status, Date)
VALUES
    -- Lost Items
    (1, 'Lost Wallet', 'Brown leather wallet containing PAN card', 'lost', 2, 'Lost', '2025-04-18 08:32:00'),
    (2, 'Lost Phone', 'OnePlus 9, blue cover', 'lost', 3, 'Lost', '2025-04-18 08:32:00'),
    (3, 'Lost Keys', 'Car keys with Maruti logo', 'lost', 4, 'Lost', '2025-04-18 08:32:00'),
    (4, 'Lost Laptop', 'HP Pavilion, silver color', 'lost', 5, 'Lost', '2025-04-18 08:32:00'),

    -- Found Items
    (5, 'Found Wallet', 'Black wallet with Indian driving license', 'found', 6, 'Found', '2025-04-18 08:32:00'),
    (6, 'Found Phone', 'Samsung Galaxy A52', 'found', 7, 'Found', '2025-04-18 08:32:00'),
    (7, 'Found Keys', 'Set of keys with Honda tag', 'found', 8, 'Found', '2025-04-18 08:32:00'),
    (8, 'Found Laptop', 'Dell Inspiron, black', 'found', 9, 'Found', '2025-04-18 08:32:00');

-- Insert Lost Item Details
INSERT INTO lost_item (Item_ID, Last_Seen_Location, Last_Seen_Date, Additional_Details, image_path)
VALUES
    (1, 'Connaught Place, Delhi', '2025-04-16', 'Had ATM and metro cards inside', 'images/lost/wallet.jpg'),
    (2, 'MG Road, Bengaluru', '2025-04-15', 'Phone had cracked screen protector', 'images/lost/phone.jpg'),
    (3, 'Phoenix Mall, Pune', '2025-04-14', 'Includes car key and locker key', 'images/lost/keys.jpg'),
    (4, 'VIT College Library, Vellore', '2025-04-13', 'Laptop in black HP bag', 'images/lost/laptop.jpg');

-- Insert Found Item Details
INSERT INTO found_item (Item_ID, Found_Location, Found_Date, Storage_Location, Additional_Details, image_path)
VALUES
    (5, 'Delhi Metro Lost & Found Office', '2025-04-17', 'Station Control Room', 'Contains ID card', 'images/found/wallet.jpg'),
    (6, 'Cubbon Park, Bengaluru', '2025-04-16', 'Police Booth', 'Pattern lock enabled', 'images/found/phone.jpg'),
    (7, 'Phoenix Mall, Pune', '2025-04-15', 'Security Desk', 'Three keys attached', 'images/found/keys.jpg'),
    (8, 'IIT Bombay Campus', '2025-04-14', 'Admin Office', 'No charger found', 'images/found/laptop.jpg');

-- Insert Reports
INSERT INTO reports (User_ID, Item_ID, Report_Type, Report_Date)
VALUES
    (2, 1, 'Lost', '2025-04-18 09:00:00'),
    (3, 2, 'Lost', '2025-04-18 09:10:00'),
    (4, 3, 'Lost', '2025-04-18 09:20:00'),
    (5, 4, 'Lost', '2025-04-18 09:30:00'),
    (6, 5, 'Found', '2025-04-18 09:40:00'),
    (7, 6, 'Found', '2025-04-18 09:50:00'),
    (8, 7, 'Found', '2025-04-18 10:00:00'),
    (9, 8, 'Found', '2025-04-18 10:10:00');

-- Display Data
SELECT * FROM user;
SELECT * FROM admin;
SELECT * FROM item;
SELECT * FROM lost_item;
SELECT * FROM found_item;
SELECT * FROM reports;
