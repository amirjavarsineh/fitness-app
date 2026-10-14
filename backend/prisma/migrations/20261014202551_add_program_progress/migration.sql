-- CreateTable
CREATE TABLE "ProgramProgress" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramProgressExercise" (
    "id" TEXT NOT NULL,
    "progressId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "actualSets" INTEGER,
    "actualReps" INTEGER,
    "actualWeight" DOUBLE PRECISION,
    "timeSpent" INTEGER,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProgramProgressExercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProgramProgress_studentId_idx" ON "ProgramProgress"("studentId");

-- CreateIndex
CREATE INDEX "ProgramProgress_assignmentId_idx" ON "ProgramProgress"("assignmentId");

-- CreateIndex
CREATE INDEX "ProgramProgress_date_idx" ON "ProgramProgress"("date");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramProgress_assignmentId_dayId_date_key" ON "ProgramProgress"("assignmentId", "dayId", "date");

-- CreateIndex
CREATE INDEX "ProgramProgressExercise_progressId_idx" ON "ProgramProgressExercise"("progressId");

-- AddForeignKey
ALTER TABLE "ProgramProgress" ADD CONSTRAINT "ProgramProgress_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "ProgramAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramProgress" ADD CONSTRAINT "ProgramProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramProgress" ADD CONSTRAINT "ProgramProgress_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "ProgramDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramProgressExercise" ADD CONSTRAINT "ProgramProgressExercise_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "ProgramProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramProgressExercise" ADD CONSTRAINT "ProgramProgressExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "ProgramExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
