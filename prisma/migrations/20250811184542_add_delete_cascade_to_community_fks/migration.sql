-- DropForeignKey
ALTER TABLE `calendar_entry` DROP FOREIGN KEY `tasks_FK_2`;

-- DropForeignKey
ALTER TABLE `debt` DROP FOREIGN KEY `debt_FK`;

-- DropForeignKey
ALTER TABLE `request` DROP FOREIGN KEY `requests_FK_1`;

-- DropForeignKey
ALTER TABLE `routine` DROP FOREIGN KEY `routine_FK`;

-- DropForeignKey
ALTER TABLE `shoppinglist_item` DROP FOREIGN KEY `shoppinglist_item_FK`;

-- DropForeignKey
ALTER TABLE `todo` DROP FOREIGN KEY `todo_FK_community`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_FK`;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_FK` FOREIGN KEY (`fk_community_id`) REFERENCES `community`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `request` ADD CONSTRAINT `requests_FK_1` FOREIGN KEY (`fk_community_id`) REFERENCES `community`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calendar_entry` ADD CONSTRAINT `tasks_FK_2` FOREIGN KEY (`fk_community_id`) REFERENCES `community`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `routine` ADD CONSTRAINT `routine_FK` FOREIGN KEY (`fk_community_id`) REFERENCES `community`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shoppinglist_item` ADD CONSTRAINT `shoppinglist_item_FK` FOREIGN KEY (`fk_community_id`) REFERENCES `community`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `debt` ADD CONSTRAINT `debt_FK` FOREIGN KEY (`fk_community_id`) REFERENCES `community`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_FK_community` FOREIGN KEY (`fk_community_id`) REFERENCES `community`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
