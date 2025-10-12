-- CreateTable
CREATE TABLE "songs" (
    "id" SERIAL NOT NULL,
    "song_name" VARCHAR(255) NOT NULL,
    "band" VARCHAR(255) NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "songs_band_idx" ON "songs"("band");
