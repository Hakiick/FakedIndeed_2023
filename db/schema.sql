-- FakedIndeed MySQL Schema
-- Database: jobboard

CREATE DATABASE IF NOT EXISTS jobboard
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE jobboard;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  userType ENUM('individual', 'company', 'admin') NOT NULL DEFAULT 'individual',
  name VARCHAR(255),
  lastname VARCHAR(255),
  phone VARCHAR(50),
  website VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_userType (userType)
) ENGINE=InnoDB;

-- Companies table
CREATE TABLE IF NOT EXISTS company (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  emails JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB;

-- Job ads table
CREATE TABLE IF NOT EXISTS ads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  jobTypes VARCHAR(500),
  minSalary INT,
  maxSalary INT,
  advantages TEXT,
  company VARCHAR(255),
  location VARCHAR(255),
  positionLocation ENUM('On-Site', 'Semi-Remote', 'Full-Remote') DEFAULT 'On-Site',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_title (title),
  INDEX idx_company (company),
  INDEX idx_location (location)
) ENGINE=InnoDB;

-- Applications table
CREATE TABLE IF NOT EXISTS apply (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ad_id INT,
  company_name VARCHAR(255),
  name VARCHAR(255),
  lastname VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  motivations TEXT,
  website VARCHAR(500),
  cv VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ad_id (ad_id),
  INDEX idx_email (email)
) ENGINE=InnoDB;
