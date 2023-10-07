/*
  Warnings:

  - Added the required column `userID` to the `commentModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `replyModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "commentModel" ADD COLUMN     "userID" STRING NOT NULL;

-- AlterTable
ALTER TABLE "replyModel" ADD COLUMN     "userID" STRING NOT NULL;
