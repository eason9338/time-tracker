CREATE TABLE IF NOT EXISTS `Pomodoros` (
  `timer_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `focus_duration` time NOT NULL,
  `break_duration` time NOT NULL,
  `session_count` time NOT NULL,
  PRIMARY KEY (`timer_id`),
  UNIQUE KEY `timer_id_UNIQUE` (`timer_id`),
  KEY `fk_user_id_pomo_idx` (`user_id`),
  CONSTRAINT `fk_user_id_pomo` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

