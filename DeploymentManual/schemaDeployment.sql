-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema db_name
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `db_name` ;

-- -----------------------------------------------------
-- Schema db_name
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `db_name` DEFAULT CHARACTER SET utf8 ;
USE `db_name` ;

-- -----------------------------------------------------
-- Table `db_name`.`company`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_name`.`company` ;

CREATE TABLE IF NOT EXISTS `db_name`.`company` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `passwordHash` VARCHAR(44) NOT NULL,
  `description` LONGTEXT NULL,
  `imagePath` VARCHAR(45) NULL DEFAULT 'None',
  `confirmed` TINYINT NOT NULL DEFAULT 0,
  `email` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_name`.`role`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_name`.`role` ;

CREATE TABLE IF NOT EXISTS `db_name`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_name`.`job`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_name`.`job` ;

CREATE TABLE IF NOT EXISTS `db_name`.`job` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  `techArea` ENUM('AiAndMl', 'RoboticProcessAutomation', 'EdgeComputing', 'QuantumComputing', 'VirtualReality', 'AugmentedReality', 'Blockchain', 'InternetOfThings', 'FiveG', 'CyberSecurity') NOT NULL,
  `description` LONGTEXT NOT NULL,
  `role_id` INT NOT NULL,
  `company_id` INT UNSIGNED NOT NULL,
  `salary` INT NULL,
  `requestedHours` INT NULL,
  `experienceLevel` VARCHAR(45) NULL,
  `city` VARCHAR(45) NULL,
  `minQualifications` LONGTEXT NULL,
  `preferredQualifications` LONGTEXT NULL,
  `postTimeUTC` VARCHAR(45) NOT NULL,
  `active` TINYINT NOT NULL DEFAULT 1,
  `contactEmail` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`, `role_id`, `company_id`),
  INDEX `fk_job_company_idx` (`company_id` ASC) VISIBLE,
  INDEX `fk_job_role1_idx` (`role_id` ASC) VISIBLE,
  CONSTRAINT `fk_job_company`
    FOREIGN KEY (`company_id`)
    REFERENCES `db_name`.`company` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_job_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `db_name`.`role` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_name`.`student`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_name`.`student` ;

CREATE TABLE IF NOT EXISTS `db_name`.`student` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `passwordHash` VARCHAR(44) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `city` VARCHAR(45) NULL,
  `phone` INT NULL,
  `passion` ENUM('AiAndMl', 'RoboticProcessAutomation', 'EdgeComputing', 'QuantumComputing', 'VirtualReality', 'AugmentedReality', 'Blockchain', 'InternetOfThings', 'FiveG', 'CyberSecurity') NOT NULL,
  `imagePath` VARCHAR(45) NULL,
  `confirmed` TINYINT NOT NULL DEFAULT 0,
  `resumePath` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_name`.`desiredRole`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_name`.`desiredRole` ;

CREATE TABLE IF NOT EXISTS `db_name`.`desiredRole` (
  `student_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  PRIMARY KEY (`student_id`, `role_id`),
  INDEX `fk_desiredRole_role1_idx` (`role_id` ASC) VISIBLE,
  CONSTRAINT `fk_desiredRole_student1`
    FOREIGN KEY (`student_id`)
    REFERENCES `db_name`.`student` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_desiredRole_role1`
    FOREIGN KEY (`role_id`)
    REFERENCES `db_name`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_name`.`skill`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_name`.`skill` ;

CREATE TABLE IF NOT EXISTS `db_name`.`skill` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_name`.`studSkill`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_name`.`studSkill` ;

CREATE TABLE IF NOT EXISTS `db_name`.`studSkill` (
  `skill_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  PRIMARY KEY (`skill_id`, `student_id`),
  INDEX `fk_studSkills_student1_idx` (`student_id` ASC) VISIBLE,
  CONSTRAINT `fk_studSkills_skill1`
    FOREIGN KEY (`skill_id`)
    REFERENCES `db_name`.`skill` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_studSkills_student1`
    FOREIGN KEY (`student_id`)
    REFERENCES `db_name`.`student` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_name`.`studentFilters`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_name`.`studentFilters` ;

CREATE TABLE IF NOT EXISTS `db_name`.`studentFilters` (
  `student_id` INT NOT NULL,
  PRIMARY KEY (`student_id`),
  CONSTRAINT `fk_stud_certs_student10`
    FOREIGN KEY (`student_id`)
    REFERENCES `db_name`.`student` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_name`.`desiredSkill`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_name`.`desiredSkill` ;

CREATE TABLE IF NOT EXISTS `db_name`.`desiredSkill` (
  `job_id` INT NOT NULL,
  `skill_id` INT NOT NULL,
  PRIMARY KEY (`job_id`, `skill_id`),
  CONSTRAINT `fk_desiredRole_student10`
    FOREIGN KEY (`skill_id`)
    REFERENCES `db_name`.`skill` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_desiredRole_role10`
    FOREIGN KEY (`job_id`)
    REFERENCES `db_name`.`job` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
