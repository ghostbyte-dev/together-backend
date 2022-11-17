-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: community
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.24-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `community`
--

DROP TABLE IF EXISTS `community`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` int(11) NOT NULL,
  `fk_admin_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `community_un` (`code`),
  KEY `community_FK` (`fk_admin_id`),
  CONSTRAINT `community_FK` FOREIGN KEY (`fk_admin_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community`
--

LOCK TABLES `community` WRITE;
/*!40000 ALTER TABLE `community` DISABLE KEYS */;
INSERT INTO `community` VALUES (4,'Hiebeler',452674,13),(5,'Hiebelers',763847,13),(6,'test shopping list',195631,13);
/*!40000 ALTER TABLE `community` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `request`
--

DROP TABLE IF EXISTS `request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `request` (
  `date` datetime NOT NULL DEFAULT curdate(),
  `fk_user_id` int(11) NOT NULL,
  `fk_community_id` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `requests_FK` (`fk_user_id`),
  KEY `requests_FK_1` (`fk_community_id`),
  CONSTRAINT `requests_FK` FOREIGN KEY (`fk_user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `requests_FK_1` FOREIGN KEY (`fk_community_id`) REFERENCES `community` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `request`
--

LOCK TABLES `request` WRITE;
/*!40000 ALTER TABLE `request` DISABLE KEYS */;
/*!40000 ALTER TABLE `request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routine`
--

DROP TABLE IF EXISTS `routine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routine` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `startDate` date NOT NULL,
  `interval` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `fk_community_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `routine_FK` (`fk_community_id`),
  CONSTRAINT `routine_FK` FOREIGN KEY (`fk_community_id`) REFERENCES `community` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routine`
--

LOCK TABLES `routine` WRITE;
/*!40000 ALTER TABLE `routine` DISABLE KEYS */;
INSERT INTO `routine` VALUES (18,'2022-11-15',3,'Kochen',4);
/*!40000 ALTER TABLE `routine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routine_user`
--

DROP TABLE IF EXISTS `routine_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routine_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_user_id` int(11) NOT NULL,
  `fk_routine_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `routine_user_FK` (`fk_routine_id`),
  KEY `routine_user_FK_1` (`fk_user_id`),
  CONSTRAINT `routine_user_FK` FOREIGN KEY (`fk_routine_id`) REFERENCES `routine` (`id`),
  CONSTRAINT `routine_user_FK_1` FOREIGN KEY (`fk_user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routine_user`
--

LOCK TABLES `routine_user` WRITE;
/*!40000 ALTER TABLE `routine_user` DISABLE KEYS */;
INSERT INTO `routine_user` VALUES (19,13,18),(20,14,18);
/*!40000 ALTER TABLE `routine_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shoppinglist_item`
--

DROP TABLE IF EXISTS `shoppinglist_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shoppinglist_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_community_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `done` tinyint(1) NOT NULL DEFAULT 0,
  `done_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `shoppinglist_item_FK` (`fk_community_id`),
  CONSTRAINT `shoppinglist_item_FK` FOREIGN KEY (`fk_community_id`) REFERENCES `community` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shoppinglist_item`
--

LOCK TABLES `shoppinglist_item` WRITE;
/*!40000 ALTER TABLE `shoppinglist_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `shoppinglist_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `notes` text DEFAULT NULL,
  `date` date NOT NULL,
  `done` tinyint(1) NOT NULL DEFAULT 0,
  `fk_community_id` int(11) NOT NULL,
  `fk_routine_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_FK_2` (`fk_community_id`),
  KEY `task_FK` (`fk_routine_id`),
  CONSTRAINT `task_FK` FOREIGN KEY (`fk_routine_id`) REFERENCES `routine` (`id`),
  CONSTRAINT `tasks_FK_2` FOREIGN KEY (`fk_community_id`) REFERENCES `community` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES (57,'Kochen','tsetss','2022-11-18',0,4,18),(58,'Kochen','test','2022-11-30',0,4,18);
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_user`
--

DROP TABLE IF EXISTS `task_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_user_id` int(11) NOT NULL,
  `fk_task_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `task_user_FK` (`fk_task_id`),
  KEY `task_user_FK_1` (`fk_user_id`),
  CONSTRAINT `task_user_FK` FOREIGN KEY (`fk_task_id`) REFERENCES `task` (`id`),
  CONSTRAINT `task_user_FK_1` FOREIGN KEY (`fk_user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_user`
--

LOCK TABLES `task_user` WRITE;
/*!40000 ALTER TABLE `task_user` DISABLE KEYS */;
INSERT INTO `task_user` VALUES (51,14,58),(52,13,57);
/*!40000 ALTER TABLE `task_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_community_id` int(11) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `verificationcode` varchar(90) DEFAULT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT 0,
  `password` varchar(100) NOT NULL,
  `creationdate` date NOT NULL DEFAULT curdate(),
  `profile_image` varchar(200) DEFAULT 'https://i.imgur.com/pWHgnHA.jpg',
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `color` varchar(7) NOT NULL DEFAULT '#2e3039',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_un` (`email`),
  UNIQUE KEY `user_un` (`verificationcode`),
  KEY `user_FK` (`fk_community_id`),
  CONSTRAINT `user_FK` FOREIGN KEY (`fk_community_id`) REFERENCES `community` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (13,4,'emanuel.hiebeler@gmail.com',NULL,1,'$2b$04$SKDzr9AqNo/HTE1iShxl1e6mh5QuBYaMSPrJb28.//XHNYwHdD2HC','2022-11-06','https://i.imgur.com/pWHgnHA.jpg','Emanuel','Hiebeler','#0f2244'),(14,NULL,'hiebeler.daniel@gmail.com','tZxdSufLMr4PdH6DIc-zc6T-P3r6nFkaBduVubKmIDjhN-N4qD-LfQLfjmt3viVfNW8ujlIvp6cxr9Vf-pOfsGNmOR',0,'$2b$04$QtB.KxInNGJIhVGZTbaLOOFqYCJLuOY6Jzor3aBuLHPpttI7IfeSy','2022-11-07','https://i.imgur.com/pWHgnHA.jpg','Daniel','Hiebeler','#2e3039'),(15,NULL,'test@gmail.com','t9sbMSiCJ8ZkRfXQyYhYMsB6eapWktCF4XzemuYG93TOc8OkypnOX_NJdT8jS2dIFy5hqX38CKJQFbf-PqpMALd1pR',0,'$2b$04$orTvSjibRCHe14trjZhfV.Gg7ndMM5Zg9s3.GL.WZoeRxLQTzYPTa','2022-11-14','https://i.imgur.com/pWHgnHA.jpg','test','test','#2e3039');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'community'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-17 20:37:57
