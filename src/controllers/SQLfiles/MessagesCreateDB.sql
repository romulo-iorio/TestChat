CREATE TABLE IF NOT EXISTS messages (
    messageId   INTEGER PRIMARY KEY AUTOINCREMENT,
    message     TEXT NOT NULL,
    email       TEXT NOT NULL,
    date        TEXT NOT NULL,
    FOREIGN KEY(email) REFERENCES login(email)
);