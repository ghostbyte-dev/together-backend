-- DropForeignKey
ALTER TABLE `calendar_entry_user` DROP FOREIGN KEY `calendar_entry_user_FK`;

-- AddForeignKey
ALTER TABLE `calendar_entry_user` ADD CONSTRAINT `calendar_entry_user_FK` FOREIGN KEY (`fk_calendar_entry_id`) REFERENCES `calendar_entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
