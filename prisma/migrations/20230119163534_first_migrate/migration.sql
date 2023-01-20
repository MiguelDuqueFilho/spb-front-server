-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "firstName" TEXT,
    "lastname" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilesEntity" (
    "id" SERIAL NOT NULL,
    "originalName" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FilesEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrupoServicos" (
    "GrpServico" VARCHAR(15) NOT NULL,
    "Descricao" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrupoServicos_pkey" PRIMARY KEY ("GrpServico")
);

-- CreateTable
CREATE TABLE "Eventos" (
    "CodEvento" VARCHAR(15) NOT NULL,
    "NomeEvento" VARCHAR(255),
    "Fluxo" VARCHAR(10) NOT NULL,
    "GrpServicoId" VARCHAR(15),
    "IsConvert" BOOLEAN NOT NULL DEFAULT false,
    "EventJson" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Eventos_pkey" PRIMARY KEY ("CodEvento")
);

-- CreateTable
CREATE TABLE "Mensagens" (
    "CodMsg" VARCHAR(15) NOT NULL,
    "Tag" VARCHAR(255) NOT NULL,
    "Descricao" VARCHAR(255) NOT NULL,
    "EntidadeOrigem" VARCHAR(50) NOT NULL,
    "EntidadeDestino" VARCHAR(50) NOT NULL,
    "CodEventoId" VARCHAR(15) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mensagens_pkey" PRIMARY KEY ("CodMsg")
);

-- CreateTable
CREATE TABLE "MessagesCreated" (
    "id" SERIAL NOT NULL,
    "codMsg" VARCHAR(15) NOT NULL,
    "xmlMessage" XML NOT NULL,
    "process" TEXT NOT NULL DEFAULT 'PENDING',
    "status" TEXT NOT NULL DEFAULT 'VALIDATED',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessagesCreated_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FilesEntity_key_key" ON "FilesEntity"("key");

-- AddForeignKey
ALTER TABLE "Eventos" ADD CONSTRAINT "Eventos_GrpServicoId_fkey" FOREIGN KEY ("GrpServicoId") REFERENCES "GrupoServicos"("GrpServico") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensagens" ADD CONSTRAINT "Mensagens_CodEventoId_fkey" FOREIGN KEY ("CodEventoId") REFERENCES "Eventos"("CodEvento") ON DELETE RESTRICT ON UPDATE CASCADE;
