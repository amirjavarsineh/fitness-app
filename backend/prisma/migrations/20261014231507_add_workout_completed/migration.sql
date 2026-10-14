-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false;
