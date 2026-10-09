-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "emoji" TEXT NOT NULL DEFAULT '🎯',
    "type" TEXT NOT NULL DEFAULT 'CUSTOM',
    "targetDays" INTEGER NOT NULL,
    "currentDays" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastCheckIn" TIMESTAMP(3),
    "checkInDates" TEXT NOT NULL DEFAULT '',
    "status" "ChallengeStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
