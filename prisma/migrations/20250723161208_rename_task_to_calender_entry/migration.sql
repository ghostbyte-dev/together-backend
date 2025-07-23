/*
  Warnings:

  - You are about to drop the `task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `task_FK`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `tasks_FK_2`;

-- DropForeignKey
ALTER TABLE `task_user` DROP FOREIGN KEY `task_user_FK`;

-- DropForeignKey
ALTER TABLE `task_user` DROP FOREIGN KEY `task_user_FK_1`;

-- DropTable
DROP TABLE `task`;

-- DropTable
DROP TABLE `task_user`;

-- CreateTable
CREATE TABLE `calendar_entry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `notes` TEXT NULL,
    `date` DATE NOT NULL,
    `done` BOOLEAN NOT NULL DEFAULT false,
    `fk_community_id` INTEGER NOT NULL,
    `fk_routine_id` INTEGER NULL,

    INDEX `calendar_entries_FK_2`(`fk_community_id`),
    INDEX `calendar_entry_FK`(`fk_routine_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calendar_entry_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_user_id` INTEGER NOT NULL,
    `fk_calendar_entry_id` INTEGER NOT NULL,

    INDEX `calendar_entry_user_FK`(`fk_calendar_entry_id`),
    INDEX `calendar_entry_user_FK_1`(`fk_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `calendar_entry` ADD CONSTRAINT `task_FK` FOREIGN KEY (`fk_routine_id`) REFERENCES `routine`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `calendar_entry` ADD CONSTRAINT `tasks_FK_2` FOREIGN KEY (`fk_community_id`) REFERENCES `community`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `calendar_entry_user` ADD CONSTRAINT `calendar_entry_user_FK` FOREIGN KEY (`fk_calendar_entry_id`) REFERENCES `calendar_entry`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `calendar_entry_user` ADD CONSTRAINT `calendar_entry_user_FK_1` FOREIGN KEY (`fk_user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
