-- CreateTable
CREATE TABLE `password_reset_token` (
    `token` VARCHAR(191) NOT NULL,
    `token_expiry` DATETIME(0) NOT NULL,
    `fk_user_id` INTEGER NOT NULL,

    UNIQUE INDEX `password_reset_token_token_key`(`token`),
    UNIQUE INDEX `password_reset_token_fk_user_id_key`(`fk_user_id`),
    INDEX `password_reset_tokens_FK_1`(`fk_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `password_reset_token` ADD CONSTRAINT `password_reset_tokens_FK_1` FOREIGN KEY (`fk_user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
