-- CreateTable
CREATE TABLE `todo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_community_id` INTEGER NOT NULL,
    `fk_user_creator_id` INTEGER NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `description` VARCHAR(200) NOT NULL,
    `creationDate` DATETIME(0) NOT NULL,

    INDEX `todo_FK_community`(`fk_community_id`),
    INDEX `todo_FK_creator`(`fk_user_creator_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_FK_community` FOREIGN KEY (`fk_community_id`) REFERENCES `community`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_FK_creator` FOREIGN KEY (`fk_user_creator_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
