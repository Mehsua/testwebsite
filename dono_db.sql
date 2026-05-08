create database dono_db;
use dono_db;

--Account table
create table dono_accounts
(
    userID int AUTO_INCREMENT PRIMARY KEY,
	username varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    country varchar(255) NOT NULL,
    role varchar(50) NOT NULL DEFAULT "user"
);

--Placeholder accounts
insert into dono_accounts (username, password, country) values
    ("BryanWonggg", "iliketurtles67", "Saudi Arabia"),
    ("Bobby123", "12345678", "Singapore");

--Admin account
insert into dono_accounts (username, password, country, role) values
    ("Admin01", "CSIT314", "Singapore", "admin");

--TODO: Add table for campaigns / Add table for donations
