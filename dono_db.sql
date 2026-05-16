create database dono_db;
use dono_db;

-- Account table
create table dono_accounts
(
    userID int AUTO_INCREMENT PRIMARY KEY,
	username varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    country varchar(255) NOT NULL,
    role varchar(50) NOT NULL DEFAULT "user"
);

-- Placeholder accounts
insert into dono_accounts (username, password, country) values
    ("User", "1234", "Saudi Arabia");

-- Admin account
insert into dono_accounts (username, password, country, role) values
    ("Admin01", "CSIT314", "Singapore", "admin");

-- TODO: Add table for campaigns / Add table for donations
create table SystemUser
(
		userID		char(4),
        name		varchar(30) not null,
        email		varchar(30) not null,
        password	varchar(30) not null,
        constraint userPK primary key (userID),
        constraint userCK unique (email)
);

create table Admin
(
	adminID		char(4),
    constraint adminPK primary key (adminID),
    constraint adminFK foreign key (adminID) references SystemUser(userID) on update cascade on delete cascade
);

create table Donee
(
	doneeID		char(4),
    constraint doneePK primary key (doneeID),
    constraint doneeFK foreign key (doneeID) references SystemUser(userID) on update cascade on delete cascade
);

create table Fundraiser
(
	fundraiserID		char(4),
    constraint fundraiserPK primary key (fundraiserID),
    constraint fundraiserFK foreign key (fundraiserID) references SystemUser(userID) on update cascade on delete cascade
);

create table Campaign
(
	campaignID		char(4),
    title			varchar(30) not null,
	country         varchar(255) not null,
    category		varchar(30) not null,
    description		varchar(100) not null,
    targetAmount	decimal(10, 2) not null,
    deadline		date not null,
    status			enum('Open', 'Closed') not null,
    createdBy		char(4) not null,
    constraint campaignPK primary key (campaignID),
    constraint campaignFK foreign key (createdBy) references Fundraiser(fundraiserID) on update cascade on delete cascade,
    CONSTRAINT chkTargetAmount CHECK (targetAmount > 0)
);

create table Donation
(
	donationID		char(4),
    donatedBy		char(4) not null,
    campaignID		char(4) not null,
    donationDate	date not null,
    amount			decimal(10, 2) not null,
    constraint donationPK primary key (donationID),
    constraint donationFK1 foreign key (donatedBy) references Donee(doneeID) on update cascade on delete cascade,
    constraint donationFK2 foreign key (campaignID) references Campaign(campaignID) on update cascade on delete cascade,
    constraint chkAmount check (amount > 0)
);

-- Fundraiser
INSERT INTO SystemUser VALUES ('U001', 'Alice Tan', 'alice@gmail.com', 'alice123');
INSERT INTO SystemUser VALUES ('U002', 'Brian Lee', 'brian@gmail.com', 'brian123');
INSERT INTO SystemUser VALUES ('U003', 'Catherine Lim', 'catherine@gmail.com', 'cat123');
INSERT INTO SystemUser VALUES ('U004', 'Daniel Ong', 'daniel@gmail.com', 'daniel123');
INSERT INTO SystemUser VALUES ('U005', 'Emily Wong', 'emily@gmail.com', 'emily123');

INSERT INTO Fundraiser VALUES ('U001');
INSERT INTO Fundraiser VALUES ('U002');
INSERT INTO Fundraiser VALUES ('U003');
INSERT INTO Fundraiser VALUES ('U004');
INSERT INTO Fundraiser VALUES ('U005');

-- Donee
INSERT INTO SystemUser VALUES ('U006', 'Kevin Lim', 'kevin@gmail.com', 'kevin123');
INSERT INTO SystemUser VALUES ('U007', 'Sarah Tan', 'sarah@gmail.com', 'sarah123');
INSERT INTO SystemUser VALUES ('U008', 'Jason Koh', 'jason@gmail.com', 'jason123');
INSERT INTO SystemUser VALUES ('U009', 'Michelle Lee', 'michelle@gmail.com', 'michelle123');
INSERT INTO SystemUser VALUES ('U010', 'Ryan Ong', 'ryan@gmail.com', 'ryan123');

INSERT INTO Donee VALUES ('U006');
INSERT INTO Donee VALUES ('U007');
INSERT INTO Donee VALUES ('U008');
INSERT INTO Donee VALUES ('U009');
INSERT INTO Donee VALUES ('U010');

-- Admin
INSERT INTO SystemUser VALUES ('U011', 'Admin One', 'admin1@gmail.com', 'admin123');
INSERT INTO SystemUser VALUES ('U012', 'Admin Two', 'admin2@gmail.com', 'admin123');
INSERT INTO SystemUser VALUES ('U013', 'Admin Three', 'admin3@gmail.com', 'admin123');
INSERT INTO SystemUser VALUES ('U014', 'Admin Four', 'admin4@gmail.com', 'admin123');
INSERT INTO SystemUser VALUES ('U015', 'Admin Five', 'admin5@gmail.com', 'admin123');

INSERT INTO Admin VALUES ('U011');
INSERT INTO Admin VALUES ('U012');
INSERT INTO Admin VALUES ('U013');
INSERT INTO Admin VALUES ('U014');
INSERT INTO Admin VALUES ('U015');

-- Campaign
INSERT INTO Campaign
VALUES ('C001', 'Nepal Relief', 'Nepal', 'Disaster', 'Help earthquake victims in Nepal', 50000.00, '2026-12-31', 'Open', 'U001');

INSERT INTO Campaign
VALUES ('C002',
'Cancer Treatment Fund',
'Singapore',
'Medical',
'Support John cancer treatment',
30000.00,
'2026-10-15',
'Open',
'U002'
);

INSERT INTO Campaign
VALUES (
'C003',
'Feed Hungry Children',
'Saudi Arabia',
'Charity',
'Provide meals for children',
20000.00,
'2026-08-20',
'Closed',
'U003'
);

INSERT INTO Campaign
VALUES (
'C004',
'Flood Victim Support',
'Saudi Arabia',
'Disaster',
'Help flood victims rebuild homes',
45000.00,
'2026-11-01',
'Open',
'U004'
);

INSERT INTO Campaign
VALUES (
'C005',
'School Scholarship Fund',
'Singapore',
'Education',
'Scholarships for poor students',
25000.00,
'2026-09-10',
'Closed',
'U005'
);

-- Donation
INSERT INTO Donation
VALUES (
'D001',
'U006',
'C001',
'2026-05-01',
100.00
);

INSERT INTO Donation
VALUES (
'D002',
'U007',
'C001',
'2026-05-02',
250.00
);

INSERT INTO Donation
VALUES (
'D003',
'U008',
'C002',
'2026-05-03',
500.00
);

INSERT INTO Donation
VALUES (
'D004',
'U009',
'C003',
'2026-05-04',
50.00
);

INSERT INTO Donation
VALUES (
'D005',
'U010',
'C004',
'2026-05-05',
300.00
);
