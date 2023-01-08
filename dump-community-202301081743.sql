-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 165.227.128.21    Database: community
-- ------------------------------------------------------
-- Server version	5.5.5-10.7.4-MariaDB-1:10.7.4+maria~focal

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community`
--

LOCK TABLES `community` WRITE;
/*!40000 ALTER TABLE `community` DISABLE KEYS */;
INSERT INTO `community` VALUES (4,'Hiebeler',452674,13);
/*!40000 ALTER TABLE `community` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `debt`
--

DROP TABLE IF EXISTS `debt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `debt` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_community_id` int(11) NOT NULL,
  `fk_user_creditor_id` int(11) NOT NULL,
  `fk_user_debtor_id` int(11) NOT NULL,
  `amount` decimal(10,0) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `debt_FK` (`fk_community_id`),
  KEY `debt_FK_1` (`fk_user_creditor_id`),
  KEY `debt_FK_2` (`fk_user_debtor_id`),
  CONSTRAINT `debt_FK` FOREIGN KEY (`fk_community_id`) REFERENCES `community` (`id`),
  CONSTRAINT `debt_FK_1` FOREIGN KEY (`fk_user_creditor_id`) REFERENCES `user` (`id`),
  CONSTRAINT `debt_FK_2` FOREIGN KEY (`fk_user_debtor_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `debt`
--

LOCK TABLES `debt` WRITE;
/*!40000 ALTER TABLE `debt` DISABLE KEYS */;
/*!40000 ALTER TABLE `debt` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routine`
--

LOCK TABLES `routine` WRITE;
/*!40000 ALTER TABLE `routine` DISABLE KEYS */;
INSERT INTO `routine` VALUES (4,'2022-11-15',3,'Kochen',4),(5,'2022-11-14',3,'Kochen',4),(6,'2022-11-16',3,'Kochen',4),(7,'2022-11-14',3,'Küchendienst',4),(8,'2022-11-15',3,'Küchendienst',4),(9,'2022-11-16',3,'Küchendienst',4),(10,'2022-11-16',7,'Müll raus',4);
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
  KEY `routine_user_FK` (`fk_routine_id`) USING BTREE,
  KEY `routine_user_FK_1` (`fk_user_id`) USING BTREE,
  CONSTRAINT `routine_user_FK` FOREIGN KEY (`fk_routine_id`) REFERENCES `routine` (`id`),
  CONSTRAINT `routine_user_FK_1` FOREIGN KEY (`fk_user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routine_user`
--

LOCK TABLES `routine_user` WRITE;
/*!40000 ALTER TABLE `routine_user` DISABLE KEYS */;
INSERT INTO `routine_user` VALUES (2,13,4),(4,14,5),(5,15,6),(6,13,7),(7,15,8),(8,14,9),(9,13,10);
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
  KEY `shoppingIist_item_FK` (`fk_community_id`) USING BTREE,
  CONSTRAINT `shoppinglist_item_FK` FOREIGN KEY (`fk_community_id`) REFERENCES `community` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shoppinglist_item`
--

LOCK TABLES `shoppinglist_item` WRITE;
/*!40000 ALTER TABLE `shoppinglist_item` DISABLE KEYS */;
INSERT INTO `shoppinglist_item` VALUES (2,4,'2kg Erdbeeren',1,'2022-11-17'),(3,4,'Test',1,'2022-11-18'),(4,4,'Test 2',1,'2022-11-18'),(5,4,'Bananen',1,'2022-11-19'),(6,4,'Erdnussbutter',1,'2022-12-10'),(7,4,'Tonno Fertigpizza ',1,'2022-11-19'),(8,4,'Test',1,'2022-11-20'),(9,4,'Basmatireis',1,'2022-11-22'),(10,4,'Pesto',1,'2022-11-24'),(11,4,'Kochschokolade',1,'2022-11-30'),(12,4,'Salatsauce',1,'2022-11-28'),(13,4,'Milch',1,'2022-11-30'),(14,4,'Tee',1,'2022-11-30'),(15,4,'Bananen ',1,'2022-11-28'),(16,4,'Vogelfutter',1,'2022-11-30'),(17,4,'Toastbrot',1,'2022-11-30'),(18,4,'high protein Joguhrt',1,'2022-12-03'),(19,4,'bio billa gemüse',1,'2022-11-30'),(20,4,'milch',1,'2022-11-30'),(21,4,'ketchup',1,'2022-11-30'),(22,4,'Milch',1,'2022-12-03'),(23,4,'Kartoffeln ',1,'2022-12-03'),(24,4,'Tiefkühlpizza tonno',1,'2022-12-03'),(25,4,'Marmelade ',1,'2022-12-10'),(26,4,'Tee',1,'2022-12-10'),(27,4,'Toast',1,'2022-12-14'),(28,4,'Tonno tiefkühlpizza',1,'2022-12-14'),(29,4,'Kaugummi',1,'2022-12-14'),(30,4,'1 liter milch',1,'2022-12-14'),(31,4,'Test',1,'2022-12-14'),(32,4,'Test',1,'2022-12-15'),(33,4,'Bananen',1,'2022-12-21'),(34,4,'1l milch',1,'2022-12-20'),(35,4,'Thunfisch dose',1,'2022-12-21'),(36,4,'Zimt',1,'2022-12-21'),(37,4,'Sekt',1,'2022-12-24'),(38,4,'Bolognese ',1,'2022-12-27'),(39,4,'Milch ',1,'2022-12-27'),(40,4,'Thunfisch ',1,'2022-12-27'),(41,4,'Müllsäcke',1,'2022-12-27'),(42,4,'Vetex',1,'2022-12-27'),(43,4,'Essig ',1,'2022-12-27'),(44,4,'Seife',1,'2022-12-27'),(45,4,'Marmelade ',1,'2022-12-27'),(46,4,'Tortillasauce',1,'2022-12-27'),(47,4,'Rösti',1,'2022-12-27'),(48,4,'Chips',1,'2022-12-27'),(49,4,'Nachos',1,'2022-12-27'),(50,4,'Cheddakäse',1,'2022-12-27'),(51,4,'Sprite, Cola, Almdudler',1,'2022-12-27'),(52,4,'Bio Billa Gemüse',1,'2022-12-31'),(53,4,'Gefrorenes Gemüse ',1,'2022-12-31'),(54,4,'Sekt',1,'2022-12-31'),(55,4,'Aufbackbrot',1,'2022-12-31'),(56,4,'Riebelgriess',1,'2023-01-07'),(57,4,'Acetatfolie für Geschenke',1,'2023-01-07'),(58,4,'Staubzucker',1,'2023-01-07'),(59,4,'Tiefkühlpizza tonno',0,'2023-01-08');
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
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES (46,'Holz zersägen','','2022-11-19',1,4,NULL),(50,'Einkaufen','','2022-11-16',1,4,NULL),(56,'Kochen','Marie','2022-11-18',0,4,4),(57,'Kochen','','2022-11-17',1,4,5),(58,'Küchendienst','Test','2022-11-18',1,4,8),(59,'Zum Häusle fahren','','2022-11-19',1,4,NULL),(60,'Küchendienst','','2022-11-19',1,4,9),(61,'Kochen','','2022-11-19',0,4,6),(62,'Küchendienst','','2022-11-20',0,4,7),(63,'Küchendienst','','2022-11-21',0,4,8),(66,'Küchendienst','','2022-11-22',0,4,9),(67,'Socken und unterhosen zusammenlegen','','2022-11-21',0,4,NULL),(69,'Kochen','','2022-11-22',1,4,6),(70,'Kochen','','2022-11-23',1,4,5),(71,'Küchendienst','','2022-11-23',0,4,7),(72,'Socken zusammenlegen','','2022-11-27',0,4,NULL),(73,'Kalenderfotos suchen','','2022-11-27',0,4,NULL),(74,'Küchendienst','','2022-11-28',1,4,9),(75,'Kochen','','2022-11-29',1,4,5),(76,'Küchendienst','','2022-11-29',1,4,7),(77,'Küchendienst','','2022-11-30',0,4,8),(78,'Kochen','','2022-11-30',0,4,4),(79,'Kochen','','2022-12-02',0,4,5),(80,'Küchendienst','','2022-12-09',0,4,8),(81,'Küchendienst','','2022-12-04',0,4,9),(82,'Küchendienst','','2022-12-03',0,4,8),(83,'Kochen','','2022-12-05',0,4,5),(84,'Küchendienst','','2022-12-05',0,4,7),(85,'Küchendienst','','2022-12-11',1,4,7),(86,'Küchendienst','','2022-12-12',1,4,8),(87,'Kochen','','2022-12-11',1,4,5),(88,'Kochen','','2022-12-13',1,4,6),(89,'Kochen','','2022-12-12',1,4,4),(90,'Kochen','','2022-12-14',1,4,5),(91,'Küchendienst','','2022-12-13',1,4,9),(92,'Milchflaschen rausstellen','','2022-12-14',1,4,NULL),(93,'Küchendienst','','2022-12-16',1,4,9),(94,'Müll raus','','2022-12-14',1,4,10),(95,'Kochen','','2022-12-15',0,4,4),(96,'Kochen','','2022-12-17',1,4,5),(97,'Kochen','','2022-12-22',0,4,6),(98,'Küchendienst','','2022-12-14',1,4,7),(99,'Kochen','','2022-12-16',0,4,6),(100,'Kochen','','2022-12-18',1,4,4),(101,'Küchendienst','','2022-12-19',0,4,9),(102,'Küchendienst','','2022-12-21',0,4,8),(103,'Küchendienst','','2022-12-23',0,4,7),(104,'Küchendienst','','2022-12-24',0,4,8),(105,'Kochen','','2022-12-23',1,4,5),(106,'Kochen','','2022-12-24',0,4,4),(107,'Kochen','','2022-12-26',0,4,5),(108,'Küchendienst','','2022-12-27',0,4,8),(109,'Küchendienst','','2022-12-26',1,4,7);
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
) ENGINE=InnoDB AUTO_INCREMENT=204 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_user`
--

LOCK TABLES `task_user` WRITE;
/*!40000 ALTER TABLE `task_user` DISABLE KEYS */;
INSERT INTO `task_user` VALUES (24,14,50),(28,15,56),(80,13,62),(86,14,60),(87,14,57),(88,13,58),(109,14,46),(110,13,59),(111,16,59),(115,15,61),(116,15,63),(119,13,67),(122,15,69),(129,13,71),(130,14,66),(131,14,70),(132,14,72),(134,14,74),(136,14,75),(139,15,76),(140,14,76),(141,13,77),(142,14,78),(143,13,79),(144,13,80),(145,15,81),(146,14,82),(147,14,83),(148,13,84),(150,15,85),(153,14,87),(155,14,88),(157,13,89),(158,13,86),(161,14,91),(163,13,92),(175,15,97),(177,13,98),(178,13,94),(180,13,90),(181,15,95),(185,15,99),(186,13,100),(187,14,96),(188,14,93),(189,15,101),(192,14,102),(193,15,103),(194,13,104),(195,14,105),(197,14,107),(198,13,106),(202,15,109),(203,13,108);
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (13,4,'emanuel.hiebeler@gmail.com',NULL,1,'$2b$04$SKDzr9AqNo/HTE1iShxl1e6mh5QuBYaMSPrJb28.//XHNYwHdD2HC','2022-11-06','https://i.imgur.com/pWHgnHA.jpg','Emanuel','Hiebeler','#CC3636'),(14,4,'hiebeler.daniel@gmail.com','tZxdSufLMr4PdH6DIc-zc6T-P3r6nFkaBduVubKmIDjhN-N4qD-LfQLfjmt3viVfNW8ujlIvp6cxr9Vf-pOfsGNmOR',0,'$2b$04$QtB.KxInNGJIhVGZTbaLOOFqYCJLuOY6Jzor3aBuLHPpttI7IfeSy','2022-11-07','https://daniebeler.com/img/schulfoto.149cd9d9.webp','Daniel','Hiebeler','#0D4C92'),(15,4,'marie.hiebeler@gmail.com','CagY7php9KRSEXLr6qhoELAL3G1DWgAf67VzjyNzAfq0_AjUk3C2WHCFnSPrCE3fXfCFq2e-oI4ePaFP2CM2V2PYwh',0,'$2b$04$2UWoJtxNaLHuk8E9XqKPl.4/ocBIXgOLjiH7E6DRQCRoMO5pvvBIy','2022-11-14','https://i.imgur.com/pWHgnHA.jpg','Marie','Hiebeler','#54B435'),(16,4,'s.hiebeler@aon.at','TPwqx8kfQovhm2w4fZU0ScTbOSiieDn67ok3WQ7TVGOcawTw8rozD9QGGOfSY00Pm6bV6cA3Ib7OuxWbmTzLRRMShG',0,'$2b$04$YVBNd5/mZK6TjeDP.MtPgeTFp2huTTTHnKL19SaPdQKjRwZQCdK7O','2022-11-14','https://i.imgur.com/pWHgnHA.jpg','Stefan ','Hiebeler','#FFC23C');
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

-- Dump completed on 2023-01-08 17:43:51
