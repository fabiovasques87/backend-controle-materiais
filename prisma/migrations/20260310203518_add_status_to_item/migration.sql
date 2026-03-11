-- CreateEnum
CREATE TYPE "Status" AS ENUM ('EMPRESTADO', 'DEVOLVIDO');

-- AlterTable
ALTER TABLE "itens" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DEVOLVIDO';
