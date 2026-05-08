create database dono_DB;

--Account table
create table dono_accounts
(
    userID int AUTO_INCREMENT PRIMARY KEY,
	username varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    country varchar(255) NOT NULL 
);

--Placeholder accounts
insert into dono_accounts (username, password, country) values
    ("BryanWonggg", "iliketurtles67", "Saudi Arabia"),
    ("Bobby123", "12345678", "Singapore");
