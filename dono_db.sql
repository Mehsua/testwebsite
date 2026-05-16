CREATE DATABASE IF NOT EXISTS dono_db;
USE dono_db;

DROP TABLE IF EXISTS Donation;
DROP TABLE IF EXISTS Campaign;
DROP TABLE IF EXISTS Admin;
DROP TABLE IF EXISTS Donee;
DROP TABLE IF EXISTS Fundraiser;
DROP TABLE IF EXISTS SystemUser;
DROP TABLE IF EXISTS dono_accounts;

CREATE TABLE dono_accounts
(
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT "user"
);

INSERT INTO dono_accounts (username, password, country) VALUES
("User", "1234", "Saudi Arabia");

INSERT INTO dono_accounts (username, password, country, role) VALUES
("Admin01", "CSIT314", "Singapore", "admin");

CREATE TABLE SystemUser
(
    userID CHAR(4),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    CONSTRAINT userPK PRIMARY KEY (userID),
    CONSTRAINT userCK UNIQUE (email)
);

CREATE TABLE Admin
(
    adminID CHAR(4),
    CONSTRAINT adminPK PRIMARY KEY (adminID),
    CONSTRAINT adminFK FOREIGN KEY (adminID) REFERENCES SystemUser(userID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE Donee
(
    doneeID CHAR(4),
    CONSTRAINT doneePK PRIMARY KEY (doneeID),
    CONSTRAINT doneeFK FOREIGN KEY (doneeID) REFERENCES SystemUser(userID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE Fundraiser
(
    fundraiserID CHAR(4),
    CONSTRAINT fundraiserPK PRIMARY KEY (fundraiserID),
    CONSTRAINT fundraiserFK FOREIGN KEY (fundraiserID) REFERENCES SystemUser(userID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE Campaign
(
    campaignID CHAR(4),
    title VARCHAR(100) NOT NULL,
    country VARCHAR(255) NOT NULL,
    category VARCHAR(30) NOT NULL,
    description TEXT NOT NULL,
    targetAmount DECIMAL(10, 2) NOT NULL,
    deadline DATE NOT NULL,
    status ENUM('Open', 'Closed') NOT NULL,
    createdBy CHAR(4) NOT NULL,

    campaignImage VARCHAR(255) NULL,
    campaignExtraImage VARCHAR(255) NULL,
    campaignVideoThumbnail VARCHAR(255) NULL,

    CONSTRAINT campaignPK PRIMARY KEY (campaignID),
    CONSTRAINT campaignFK FOREIGN KEY (createdBy) REFERENCES Fundraiser(fundraiserID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT chkTargetAmount CHECK (targetAmount > 0)
);

CREATE TABLE Donation
(
    donationID CHAR(4),
    donatedBy CHAR(4) NOT NULL,
    campaignID CHAR(4) NOT NULL,
    donationDate DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    CONSTRAINT donationPK PRIMARY KEY (donationID),
    CONSTRAINT donationFK1 FOREIGN KEY (donatedBy) REFERENCES Donee(doneeID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT donationFK2 FOREIGN KEY (campaignID) REFERENCES Campaign(campaignID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT chkAmount CHECK (amount > 0)
);

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

INSERT INTO Campaign
(
    campaignID,
    title,
    country,
    category,
    description,
    targetAmount,
    deadline,
    status,
    createdBy,
    campaignImage,
    campaignExtraImage,
    campaignVideoThumbnail
)
VALUES
(
    'C001',
    'Nepal Relief',
    'Nepal',
    'Disaster',
    'Help earthquake victims in Nepal',
    50000.00,
    '2026-12-31',
    'Open',
    'U001',
    NULL,
    NULL,
    NULL
);

INSERT INTO Campaign
(
    campaignID,
    title,
    country,
    category,
    description,
    targetAmount,
    deadline,
    status,
    createdBy,
    campaignImage,
    campaignExtraImage,
    campaignVideoThumbnail
)
VALUES
(
    'C002',
    'Cancer Treatment Fund',
    'Singapore',
    'Medical',
    'Support John cancer treatment',
    30000.00,
    '2026-10-15',
    'Open',
    'U002',
    NULL,
    NULL,
    NULL
);

INSERT INTO Campaign
(
    campaignID,
    title,
    country,
    category,
    description,
    targetAmount,
    deadline,
    status,
    createdBy,
    campaignImage,
    campaignExtraImage,
    campaignVideoThumbnail
)
VALUES
(
    'C003',
    'Feed Hungry Children',
    'Saudi Arabia',
    'Charity',
    'Provide meals for children',
    20000.00,
    '2026-08-20',
    'Closed',
    'U003',
    NULL,
    NULL,
    NULL
);

INSERT INTO Campaign
(
    campaignID,
    title,
    country,
    category,
    description,
    targetAmount,
    deadline,
    status,
    createdBy,
    campaignImage,
    campaignExtraImage,
    campaignVideoThumbnail
)
VALUES
(
    'C004',
    'Flood Victim Support',
    'Saudi Arabia',
    'Disaster',
    'Help flood victims rebuild homes',
    45000.00,
    '2026-11-01',
    'Open',
    'U004',
    NULL,
    NULL,
    NULL
);

INSERT INTO Campaign
(
    campaignID,
    title,
    country,
    category,
    description,
    targetAmount,
    deadline,
    status,
    createdBy,
    campaignImage,
    campaignExtraImage,
    campaignVideoThumbnail
)
VALUES
(
    'C005',
    'School Scholarship Fund',
    'Singapore',
    'Education',
    'Scholarships for poor students',
    25000.00,
    '2026-09-10',
    'Closed',
    'U005',
    NULL,
    NULL,
    NULL
);

INSERT INTO Donation VALUES ('D001', 'U006', 'C001', '2026-05-01', 100.00);
INSERT INTO Donation VALUES ('D002', 'U007', 'C001', '2026-05-02', 250.00);
INSERT INTO Donation VALUES ('D003', 'U008', 'C002', '2026-05-03', 500.00);
INSERT INTO Donation VALUES ('D004', 'U009', 'C003', '2026-05-04', 50.00);
INSERT INTO Donation VALUES ('D005', 'U010', 'C004', '2026-05-05', 300.00);
