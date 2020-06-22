CREATE TABLE IF NOT EXISTS user (
    nickname    TEXT PRIMARY KEY,
    email       TEXT NOT NULL,
    name        TEXT NOT NULL,
    gender      TEXT NOT NULL,
    birthday    TEXT NOT NULL,
    image       TEXT NOT NULL,
    FOREIGN KEY(email) REFERENCES login(email)
);