CREATE DATABASE wzstatistics;
USE wzstatistics;

-- Create tables needed

CREATE TABLE templates
(
    tid INTEGER PRIMARY KEY,
    name VARCHAR(64) NOT NULL
);

CREATE TABLE ladders
(
    lid INTEGER PRIMARY KEY NOT NULL,
    name VARCHAR(32) NOT NULL,
    game_count INTEGER NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    tid INTEGER NOT NULL,
    active BIT NOT NULL,
    FOREIGN KEY (tid) REFERENCES templates(tid),
);

CREATE TABLE players
(
    pid INTEGER NOT NULL,
    name VARCHAR(128) NOT NULL,
    version INTEGER AUTO_INCREMENT NOT NULL,
    PRIMARY KEY (pid, name, version)
);

CREATE TABLE games
(
    gid INTEGER PRIMARY KEY NOT NULL,
    lid INTEGER NOT NULL,
    winner BIT NOT NULL,
    booted BIT NOT NULL,
    turns INTEGER NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,

    player0_id INTEGER NOT NULL,
    player0_colour INTEGER NOT NULL,

    player1_id INTEGER NOT NULL,
    player1_colour INTEGER NOT NULL,

    FOREIGN KEY (lid) REFERENCES ladders(lid)
);

CREATE TABLE daily_standing
(
    lid INTEGER NOT NULL,
    date DATE NOT NULL,
    games INTEGER NOT NULL,
    PRIMARY KEY (lid, date),
    FOREIGN KEY (lid) REFERENCES ladders(lid)
);
