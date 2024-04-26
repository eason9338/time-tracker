CREATE TABLE IF NOT EXISTS `Records` (
  `record_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `record_name` varchar(255) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `duration` time NOT NULL,
  `record_date` date NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`record_id`),
  UNIQUE KEY `ID_UNIQUE` (`record_id`),
  KEY `userID_idx` (`user_id`),
  KEY `fk_tag_id_records_idx` (`tag_id`),
  CONSTRAINT `fk_tag_id_records` FOREIGN KEY (`tag_id`) REFERENCES `Tags` (`tag_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_id_records` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
