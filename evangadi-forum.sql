CREATE TABLE users(
    userid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) UNIQUE,
    firstname VARCHAR(20) NOT NULL,
    lastname VARCHAR(20) NOT NULL,
    email VARCHAR(40) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE questions(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    questionid INT NOT NUll UNIQUE,
    userid INT NOT NULL,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(200) NOT NULL,
    tag VARCHAR(20),
    FOREIGN KEY(userid) REFERENCES users(userid)
);

CREATE TABLE answers (
    answerid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    questionid INT NOT NULL,
    answer VARCHAR(200) NOT NULL,
    FOREIGN KEY(questionid) REFERENCES questions(questionid),
    FOREIGN KEY(userid) REFERENCES users(userid)
);