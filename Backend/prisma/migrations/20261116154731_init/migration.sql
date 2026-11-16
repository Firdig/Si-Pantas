-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('KADER', 'OPERATOR');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "CollectionTaskStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "EducationStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('KADER', 'OPERATOR', 'TPS', 'SYSTEM');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tps_contacts" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tps_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waste_points" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "photo_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waste_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_groups" (
    "id" UUID NOT NULL,
    "group_code" TEXT NOT NULL,
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "report_code" TEXT NOT NULL,
    "group_id" UUID NOT NULL,
    "waste_point_id" UUID NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_tasks" (
    "id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "tps_contact_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "status" "CollectionTaskStatus" NOT NULL DEFAULT 'ACTIVE',
    "opened_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collection_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_status_histories" (
    "id" UUID NOT NULL,
    "report_id" UUID NOT NULL,
    "changed_by_id" UUID,
    "actor_type" "ActorType" NOT NULL,
    "old_status" "ReportStatus",
    "new_status" "ReportStatus" NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_status_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_photos" (
    "id" UUID NOT NULL,
    "report_id" UUID NOT NULL,
    "storage_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education_contents" (
    "id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "image_url" TEXT,
    "status" "EducationStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "education_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "actor_type" "ActorType" NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tps_contacts_phone_number_key" ON "tps_contacts"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "report_groups_group_code_key" ON "report_groups"("group_code");

-- CreateIndex
CREATE UNIQUE INDEX "reports_report_code_key" ON "reports"("report_code");

-- CreateIndex
CREATE INDEX "reports_group_id_idx" ON "reports"("group_id");

-- CreateIndex
CREATE INDEX "reports_waste_point_id_idx" ON "reports"("waste_point_id");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE UNIQUE INDEX "collection_tasks_group_id_key" ON "collection_tasks"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "collection_tasks_token_hash_key" ON "collection_tasks"("token_hash");

-- CreateIndex
CREATE INDEX "collection_tasks_status_expires_at_idx" ON "collection_tasks"("status", "expires_at");

-- CreateIndex
CREATE INDEX "report_status_histories_report_id_created_at_idx" ON "report_status_histories"("report_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "education_contents_slug_key" ON "education_contents"("slug");

-- CreateIndex
CREATE INDEX "activity_logs_created_at_idx" ON "activity_logs"("created_at");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_groups" ADD CONSTRAINT "report_groups_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "report_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_waste_point_id_fkey" FOREIGN KEY ("waste_point_id") REFERENCES "waste_points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_tasks" ADD CONSTRAINT "collection_tasks_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "report_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_tasks" ADD CONSTRAINT "collection_tasks_tps_contact_id_fkey" FOREIGN KEY ("tps_contact_id") REFERENCES "tps_contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_status_histories" ADD CONSTRAINT "report_status_histories_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_status_histories" ADD CONSTRAINT "report_status_histories_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_photos" ADD CONSTRAINT "report_photos_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_contents" ADD CONSTRAINT "education_contents_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
