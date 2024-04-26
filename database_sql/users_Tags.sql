CREATE TABLE IF NOT EXISTS `Tags` (
  `tag_id` int NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(225) NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`tag_id`),
  UNIQUE KEY `tag_id_UNIQUE` (`tag_id`),
  KEY `fk_user_id_tag_idx` (`user_id`),
  CONSTRAINT `fk_user_id_tag` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
