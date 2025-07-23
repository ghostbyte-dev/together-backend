-- CreateTable
CREATE TABLE `community` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `code` INTEGER NOT NULL,
    `fk_admin_id` INTEGER NOT NULL,

    UNIQUE INDEX `community_un`(`code`),
    INDEX `community_FK`(`fk_admin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_community_id` INTEGER NULL,
    `email` VARCHAR(100) NOT NULL,
    `verificationcode` VARCHAR(90) NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `password` VARCHAR(100) NOT NULL,
    `creationdate` DATE NOT NULL DEFAULT (curdate()),
    `profile_image` VARCHAR(200) NULL DEFAULT 'https://i.imgur.com/pWHgnHA.jpg',
    `firstname` VARCHAR(100) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `color` VARCHAR(7) NOT NULL DEFAULT '#2e3039',

    UNIQUE INDEX `user_email_un`(`email`),
    UNIQUE INDEX `user_un`(`verificationcode`),
    INDEX `user_FK`(`fk_community_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `request` (
    `date` DATETIME(0) NOT NULL DEFAULT (curdate()),
    `fk_user_id` INTEGER NOT NULL,
    `fk_community_id` INTEGER NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    INDEX `requests_FK`(`fk_user_id`),
    INDEX `requests_FK_1`(`fk_community_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `notes` TEXT NULL,
    `date` DATE NOT NULL,
    `done` BOOLEAN NOT NULL DEFAULT false,
    `fk_community_id` INTEGER NOT NULL,
    `fk_routine_id` INTEGER NULL,

    INDEX `tasks_FK_2`(`fk_community_id`),
    INDEX `task_FK`(`fk_routine_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_user_id` INTEGER NOT NULL,
    `fk_task_id` INTEGER NOT NULL,

    INDEX `task_user_FK`(`fk_task_id`),
    INDEX `task_user_FK_1`(`fk_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `routine` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startDate` DATE NOT NULL,
    `interval` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `fk_community_id` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    INDEX `routine_FK`(`fk_community_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `routine_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_user_id` INTEGER NOT NULL,
    `fk_routine_id` INTEGER NOT NULL,

    INDEX `routine_user_FK`(`fk_routine_id`),
    INDEX `routine_user_FK_1`(`fk_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shoppinglist_item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_community_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `done` BOOLEAN NOT NULL DEFAULT false,
    `done_date` DATE NULL,

    INDEX `shoppinglist_item_FK`(`fk_community_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `debt` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_community_id` INTEGER NOT NULL,
    `fk_user_creditor_id` INTEGER NOT NULL,
    `fk_user_debitor_id` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `timestamp` DATETIME(0) NOT NULL DEFAULT (curdate()),

    INDEX `debt_FK`(`fk_community_id`),
    INDEX `debt_FK_1`(`fk_user_creditor_id`),
    INDEX `debt_FK_2`(`fk_user_debitor_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_communityUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_communityUser_AB_unique`(`A`, `B`),
    INDEX `_communityUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `community` ADD CONSTRAINT `community_FK` FOREIGN KEY (`fk_admin_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_FK` FOREIGN KEY (`fk_community_id`) REFERENCES `community`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `request` ADD CONSTRAINT `requests_FK` FOREIGN KEY (`fk_user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `request` ADD CONSTRAINT `requests_FK_1` FOREIGN KEY (`fk_community_id`) REFERENCES `community`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `task_FK` FOREIGN KEY (`fk_routine_id`) REFERENCES `routine`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `tasks_FK_2` FOREIGN KEY (`fk_community_id`) REFERENCES `community`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `task_user` ADD CONSTRAINT `task_user_FK` FOREIGN KEY (`fk_task_id`) REFERENCES `task`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `task_user` ADD CONSTRAINT `task_user_FK_1` FOREIGN KEY (`fk_user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `routine` ADD CONSTRAINT `routine_FK` FOREIGN KEY (`fk_community_id`) REFERENCES `community`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `routine_user` ADD CONSTRAINT `routine_user_FK` FOREIGN KEY (`fk_routine_id`) REFERENCES `routine`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `routine_user` ADD CONSTRAINT `routine_user_FK_1` FOREIGN KEY (`fk_user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `shoppinglist_item` ADD CONSTRAINT `shoppinglist_item_FK` FOREIGN KEY (`fk_community_id`) REFERENCES `community`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `debt` ADD CONSTRAINT `debt_FK` FOREIGN KEY (`fk_community_id`) REFERENCES `community`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `debt` ADD CONSTRAINT `debt_FK_1` FOREIGN KEY (`fk_user_creditor_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `debt` ADD CONSTRAINT `debt_FK_2` FOREIGN KEY (`fk_user_debitor_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `_communityUser` ADD CONSTRAINT `_communityUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `community`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_communityUser` ADD CONSTRAINT `_communityUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

