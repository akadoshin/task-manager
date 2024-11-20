-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "nickname" VARCHAR(15) NOT NULL,
    "hash" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_hash_key" ON "user"("hash");

-- CreateIndex
CREATE INDEX "user_nickname_hash_idx" ON "user"("nickname", "hash");
