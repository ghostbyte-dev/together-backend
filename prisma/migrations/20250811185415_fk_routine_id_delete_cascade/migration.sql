-- DropForeignKey
ALTER TABLE `calendar_entry` DROP FOREIGN KEY `task_FK`;

-- DropForeignKey
ALTER TABLE `routine_user` DROP FOREIGN KEY `routine_user_FK`;

-- AddForeignKey
ALTER TABLE `calendar_entry` ADD CONSTRAINT `task_FK` FOREIGN KEY (`fk_routine_id`) REFERENCES `routine`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `routine_user` ADD CONSTRAINT `routine_user_FK` FOREIGN KEY (`fk_routine_id`) REFERENCES `routine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
