-- CreateTable
CREATE TABLE "AppConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AppConfig_key_key" ON "AppConfig"("key");

-- Insert default distribution config
INSERT INTO "AppConfig" ("key", "value", "description", "updatedAt") VALUES 
('distributionType', 'STORE', 'Tipo de distribuicao: STORE ou DIRECT', CURRENT_TIMESTAMP),
('p2pEnabled', 'false', 'P2P habilitado para versao DIRECT', CURRENT_TIMESTAMP);
