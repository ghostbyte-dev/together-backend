-- DropForeignKey
ALTER TABLE `calendar_entry_user` DROP FOREIGN KEY `calendar_entry_user_FK_1`;

-- DropForeignKey
ALTER TABLE `debt` DROP FOREIGN KEY `debt_FK_1`;

-- DropForeignKey
ALTER TABLE `debt` DROP FOREIGN KEY `debt_FK_2`;

-- DropForeignKey
ALTER TABLE `password_reset_token` DROP FOREIGN KEY `password_reset_tokens_FK_1`;

-- DropForeignKey
ALTER TABLE `request` DROP FOREIGN KEY `requests_FK`;

-- DropForeignKey
ALTER TABLE `routine_user` DROP FOREIGN KEY `routine_user_FK_1`;

-- DropForeignKey
ALTER TABLE `todo` DROP FOREIGN KEY `todo_FK_creator`;

-- AlterTable
ALTER TABLE `debt` MODIFY `fk_user_creditor_id` INTEGER NULL,
    MODIFY `fk_user_debitor_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `password_reset_token` ADD CONSTRAINT `password_reset_tokens_FK_1` FOREIGN KEY (`fk_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request` ADD CONSTRAINT `requests_FK` FOREIGN KEY (`fk_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calendar_entry_user` ADD CONSTRAINT `calendar_entry_user_FK_1` FOREIGN KEY (`fk_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `routine_user` ADD CONSTRAINT `routine_user_FK_1` FOREIGN KEY (`fk_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `debt` ADD CONSTRAINT `debt_FK_1` FOREIGN KEY (`fk_user_creditor_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `debt` ADD CONSTRAINT `debt_FK_2` FOREIGN KEY (`fk_user_debitor_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_FK_creator` FOREIGN KEY (`fk_user_creator_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
