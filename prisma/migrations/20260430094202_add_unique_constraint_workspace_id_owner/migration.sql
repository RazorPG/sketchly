/*
  Warnings:

  - A unique constraint covering the columns `[id,ownerId]` on the table `workspaces` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "workspaces_id_ownerId_key" ON "workspaces"("id", "ownerId");
