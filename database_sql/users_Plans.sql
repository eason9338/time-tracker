CREATE TABLE IF NOT EXISTS `Plans` (
  `plan_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `target_hours` int NOT NULL,
  `actual_hours` int NOT NULL,
  `plan_date` datetime NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`plan_id`),
  UNIQUE KEY `plan_id_UNIQUE` (`plan_id`),
  KEY `fk_user_id_idx` (`user_id`),
  KEY `fk_tag_id_plans_idx` (`tag_id`),
  CONSTRAINT `fk_tag_id_plans` FOREIGN KEY (`tag_id`) REFERENCES `Tags` (`tag_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_id_plans` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

