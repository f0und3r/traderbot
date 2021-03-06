CREATE TABLE IF NOT EXISTS `store` (
  `id` INT(8) UNSIGNED AUTO_INCREMENT,
  `created_at` DATETIME,
  `updated_at` DATETIME,
  `type` ENUM("sell", "buy"),
  `state` ENUM("created", "updated", "sended", "failure"),
  `owner` VARCHAR(255),
  `title` VARCHAR(255),
  `map` VARCHAR(255),
  `x` SMALLINT(3) UNSIGNED,
  `y` SMALLINT(3) UNSIGNED,
  PRIMARY KEY (`id`),
  UNIQUE (`owner`)
);

CREATE TABLE IF NOT EXISTS `store_items` (
  `id` INT(8) UNSIGNED AUTO_INCREMENT,
  `created_at` DATETIME,
  `updated_at` DATETIME,
  `store_id` INT(8) UNSIGNED,
  `item_id` SMALLINT(5) UNSIGNED,
  `count` SMALLINT(5) UNSIGNED,
  `amount` INT(16) UNSIGNED,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`store_id`) REFERENCES `store` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `watch` (
  `id` INT(8) UNSIGNED AUTO_INCREMENT,
  `chat_id` BIGINT(32),
  `item_id` SMALLINT(5) UNSIGNED,
  `created_at` DATETIME,
  `updated_at` DATETIME,
  `type` ENUM("sell", "buy"),
  `amount` INT(16) UNSIGNED,
  PRIMARY KEY (`id`),
  UNIQUE (`chat_id`, `item_id`, `type`)
);

CREATE TABLE IF NOT EXISTS `cards` (
  `id` INT(8) UNSIGNED AUTO_INCREMENT,
  `item_id` SMALLINT(5) UNSIGNED,
  `created_at` DATETIME DEFAULT NOW(),
  `owner` VARCHAR(255),
  PRIMARY KEY (`id`),
  KEY (`owner`)
);