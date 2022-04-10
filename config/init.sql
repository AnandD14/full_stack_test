CREATE DATABASE IF NOT EXISTS full_stack_test;

USE full_stack_test;

DROP TABLE IF EXISTS Experiment;

CREATE TABLE `Experiment` (
  `eid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint DEFAULT NULL,
  PRIMARY KEY (`eid`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS Question;

CREATE TABLE `Question` (
  `qid` int NOT NULL AUTO_INCREMENT,
  `question` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `eid` int NOT NULL,
  `Choices` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`qid`),
  KEY `Question_eid_fkey` (`eid`),
  CONSTRAINT `Question_eid_fkey` FOREIGN KEY (`eid`) REFERENCES `Experiment` (`eid`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS Response;

CREATE TABLE `Response` (
  `id` int NOT NULL AUTO_INCREMENT,
  `eid` int NOT NULL,
  `qid` int NOT NULL,
  `answer` longtext NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `eid` (`eid`),
  KEY `qid` (`qid`),
  CONSTRAINT `response_ibfk_1` FOREIGN KEY (`eid`) REFERENCES `Experiment` (`eid`),
  CONSTRAINT `response_ibfk_2` FOREIGN KEY (`qid`) REFERENCES `Question` (`qid`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE USER 'test_user'@'172.17.0.1' IDENTIFIED BY 'tu@MySql7';

GRANT ALL PRIVILEGES ON full_stack_test.* TO 'test_user'@'172.17.0.1';

FLUSH PRIVILEGES;