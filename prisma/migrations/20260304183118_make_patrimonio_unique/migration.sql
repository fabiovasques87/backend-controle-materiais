/*
  Warnings:

  - A unique constraint covering the columns `[patrimonio]` on the table `itens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "itens_patrimonio_key" ON "itens"("patrimonio");
