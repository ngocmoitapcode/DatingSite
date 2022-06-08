SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE TABLE IF NOT EXISTS 
`gender` (
  `user_gender` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`user_gender`))
ENGINE = InnoDB;

INSERT INTO `date_app`.`gender` (`user_gender`) VALUES ('Male');
INSERT INTO `date_app`.`gender` (`user_gender`) VALUES ('Female');

CREATE TABLE IF NOT EXISTS `user_account` (
  `user_cometchat_uid` VARCHAR(255) NOT NULL,
  `user_email` VARCHAR(255) NOT NULL,
  `user_password` VARCHAR(255) NOT NULL,
  `user_full_name` VARCHAR(255) NOT NULL,
  `user_age` INT NOT NULL,
  `user_avatar` VARCHAR(255) NOT NULL,
  `user_gender` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`user_cometchat_uid`),
  INDEX `fk_user_account_gender2_idx` (`user_gender` ASC) VISIBLE,
  CONSTRAINT `fk_user_account_gender2`
    FOREIGN KEY (`user_gender`)
    REFERENCES `gender` (`user_gender`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO `user_account` VALUES ('11481cb0-d872-47ea-8378-4760e793b40b','emmawatson@gmail.com','$2b$10$v1mPhpuYKEEC9vkZOMw87ejudAcjYvQLH2jD8cQ4lROAukonpYFES','Emma Watson',30,'/img/avatar-1653403606156.jpg','Female'),('3db56c12-a438-4395-9c4d-d69e664d5e4c','vuthanhlam247@gmail.com','$2b$10$HzdjIKUMAze1EnsXllRo4OHTb4n4mzRiVP1zLDPlRBTwvmeCv7Gh6','Vũ Thanh Lâm',20,'/img/avatar-1653366738874.jpg','Male'),('444f7218-f1d3-4e2e-bd77-3da5434d94af','cuhodilimo@gmail.com','$2b$10$uSeRF46inl7IAZKgizDr0el70gGxuH6wnjZQX7mP1ruh9ikURkSIq','Amber Heard',36,'/img/avatar-1653887631469.png','Female'),('6cf0678b-935d-46cf-be6c-d7c5a304eb4c','johnnydepp@gmail.com','$2b$10$cQafTkPMv.mF2EZoLuCFSeP8PKmT2SJz.Ws48OZP0ZT0soIzG1GNa','Johnny Depp',58,'/img/avatar-1653888921116.jpg','Male'),('9cce5898-b115-438d-aecb-d7bf48f8493f','elizabetholsen','$2b$10$5m5NSR.lxc6YX.0FjH0nOOsADevYZzx3gGGx.Z1HfZ.mmK3ckA4Se','Elizabeth Olsen',33,'/img/avatar-1653887964739.jpg','Female'),('b347b75e-fedf-4485-b41a-ed5cb473b138','cuhodicamry@gmail.com','$2b$10$/ynCTTaAsDkrzZLhVWOBbeqbQ/AJg2yHTJgYyLbB.zpcGCJ1zyxG6','Vũ Thanh Lâm',20,'/img/avatar-1653193406226.jpg','Male'),('b7cd9daf-a893-4ac8-95f9-9145b402bc9f','andrewgarfield@gmail.com','$2b$10$NIXsNlK5Eb/r0gJd6cYdA.05cHTKLPkdPrtyUxxOWwiIFsDMA0hvq','Andrew Garfield',38,'/img/avatar-1653888828400.jpg','Male'),('c08418d6-4fff-4442-aabe-4aa6cdf92443','emmastone@gmail.com','$2b$10$LQq0zWadylidZXouZRUVpOGpUXsfMaLXDxm0UR0lLDtBoe.aZZdSG','Emma Stone',33,'/img/avatar-1653888698637.webp','Female'),('c7fc2701-9260-44dd-80a3-1733072bc3b7','scarlettjohansson@gmail.com','$2b$10$DYNQXpXxjU88Lzb9L7VMQuBkIlY0sjv5vetKTMsQWzboaxx9FQcaG','Scarlett Johansson',37,'/img/avatar-1653888280471.jpg','Female'),('d9391052-c49f-495e-8fe7-25e141a2a304','arianagrande@gmail.com','$2b$10$tqk/lKpiyQkU32sDGAfLh.suuWIXtesc4homiWRgzoRAw39Zm0oYu','Ariana Grande',28,'/img/avatar-1653887772105.jpg','Female');

CREATE TABLE IF NOT EXISTS `match_request` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `match_request_from` VARCHAR(255) NOT NULL,
  `match_request_to` VARCHAR(255) NOT NULL,
  `match_request_sender` VARCHAR(255) NOT NULL,
  `match_request_receiver` VARCHAR(255) NOT NULL,
  `match_request_status` INT NOT NULL,
  `created_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `accepted_date` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK_UserIDFrom` (`match_request_from` ASC) VISIBLE,
  INDEX `FK_UserIDTo` (`match_request_to` ASC) VISIBLE,
  CONSTRAINT `FK_UserIDFrom`
    FOREIGN KEY (`match_request_from`)
    REFERENCES `user_account` (`user_cometchat_uid`)
    ON UPDATE CASCADE,
  CONSTRAINT `FK_UserIDTo`
    FOREIGN KEY (`match_request_to`)
    REFERENCES `user_account` (`user_cometchat_uid`)
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `block_user` (
  `user_block` VARCHAR(255) NOT NULL,
  `user_blocked` VARCHAR(255) NOT NULL,
  `block_time` DATETIME NULL DEFAULT NULL,
  INDEX `fk_block_user_user_account1_idx` (`user_block` ASC) VISIBLE,
  INDEX `fk_block_user_user_account2_idx` (`user_blocked` ASC) VISIBLE,
  CONSTRAINT `fk_block_user_user_account1`
    FOREIGN KEY (`user_block`)
    REFERENCES `user_account` (`user_cometchat_uid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_block_user_user_account2`
    FOREIGN KEY (`user_blocked`)
    REFERENCES `user_account` (`user_cometchat_uid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `relation_type` (
  `relation_type` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`relation_type`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `interested_in_relation` (
  `user_account` VARCHAR(255) NOT NULL,
  `relation_type` VARCHAR(255) NOT NULL,
  INDEX `fk_interested_in_relation_user_account1_idx` (`user_account` ASC) VISIBLE,
  INDEX `fk_interested_in_relation_relation_type1_idx` (`relation_type` ASC) VISIBLE,
  CONSTRAINT `fk_interested_in_relation_user_account1`
    FOREIGN KEY (`user_account`)
    REFERENCES `user_account` (`user_cometchat_uid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_interested_in_relation_relation_type1`
    FOREIGN KEY (`relation_type`)
    REFERENCES `relation_type` (`relation_type`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `conversation` (
  `id_conversation` INT NOT NULL,
  `user_account` VARCHAR(255) NOT NULL,
  `start_at` TIMESTAMP NULL,
  `close_at` TIMESTAMP NULL,
  PRIMARY KEY (`id_conversation`),
  INDEX `fk_conversation_user_account1_idx` (`user_account` ASC) VISIBLE,
  CONSTRAINT `fk_conversation_user_account1`
    FOREIGN KEY (`user_account`)
    REFERENCES `user_account` (`user_cometchat_uid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `participant` (
  `id_participant` VARCHAR(45) NOT NULL,
  `participant_account` VARCHAR(255) NOT NULL,
  `join_in` TIMESTAMP NULL,
  `join_out` TIMESTAMP NULL,
  `id_conversation` INT NOT NULL,
  INDEX `fk_participant_user_account1_idx` (`participant_account` ASC) VISIBLE,
  PRIMARY KEY (`id_participant`),
  INDEX `fk_participant_conversation1_idx` (`id_conversation` ASC) VISIBLE,
  CONSTRAINT `fk_participant_user_account1`
    FOREIGN KEY (`participant_account`)
    REFERENCES `user_account` (`user_cometchat_uid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_participant_conversation1`
    FOREIGN KEY (`id_conversation`)
    REFERENCES `conversation` (`id_conversation`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `message` (
  `id_message` INT NOT NULL,
  `id_participant` VARCHAR(45) NOT NULL,
  `message_text` VARCHAR(45) NOT NULL,
  `start_at` TIMESTAMP NULL,
  `close_at` TIMESTAMP NULL,
  PRIMARY KEY (`id_message`),
  INDEX `fk_message_participant1_idx` (`id_participant` ASC) VISIBLE,
  CONSTRAINT `fk_message_participant1`
    FOREIGN KEY (`id_participant`)
    REFERENCES `participant` (`id_participant`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;




SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
