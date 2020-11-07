CREATE DATABASE wzstatistics;
USE wzstatistics;

-- Create tables needed

CREATE TABLE templates
(
    tid BIGINT PRIMARY KEY,
    name VARCHAR(64) NOT NULL
);

CREATE TABLE ladders
(
    lid INTEGER PRIMARY KEY NOT NULL,
    name VARCHAR(32) NOT NULL,
    game_count INTEGER NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    last_updated TIMESTAMP NOT NULL,
    tid BIGINT NOT NULL,
    active BOOLEAN NOT NULL,
    FOREIGN KEY (tid) REFERENCES templates(tid)
);

CREATE TABLE players
(
    pid BIGINT NOT NULL,
    name VARCHAR(128) NOT NULL,
    version SERIAL NOT NULL,
    PRIMARY KEY (pid, name, version)
);

CREATE TABLE games
(
    gid BIGINT PRIMARY KEY NOT NULL,
    lid INTEGER NOT NULL,
    winner CHAR(1) NOT NULL,
    booted BOOLEAN NOT NULL,
    turns INTEGER NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,

    player0_id BIGINT NOT NULL,
    player0_colour CHAR(6) NOT NULL,

    player1_id BIGINT NOT NULL,
    player1_colour CHAR(6) NOT NULL,

    FOREIGN KEY (lid) REFERENCES ladders(lid)
);

CREATE TABLE player_results
(
    pid BIGINT NOT NULL,
    lid INTEGER NOT NULL,
    wins SMALLINT NOT NULL DEFAULT 0,
    losses SMALLINT NOT NULL DEFAULT 0,
    elo SMALLINT NOT NULL DEFAULT 1500,
    PRIMARY KEY (pid, lid),
    FOREIGN KEY (lid) REFERENCES ladders(lid)
);

CREATE TABLE daily_standing
(
    lid BIGINT NOT NULL,
    date DATE NOT NULL,
    games INTEGER NOT NULL,
    PRIMARY KEY (lid, date),
    FOREIGN KEY (lid) REFERENCES ladders(lid)
);
