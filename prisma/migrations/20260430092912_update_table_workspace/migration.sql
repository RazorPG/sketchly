-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "history" JSONB NOT NULL DEFAULT '{}';
