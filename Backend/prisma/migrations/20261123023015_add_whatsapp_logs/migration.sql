-- CreateEnum
CREATE TYPE "WhatsappDeliveryStatus" AS ENUM ('QUEUED', 'SENT', 'DELIVERED', 'FAILED');

-- CreateTable
CREATE TABLE "whatsapp_logs" (
    "id" UUID NOT NULL,
    "collection_task_id" UUID NOT NULL,
    "recipient_phone" TEXT NOT NULL,
    "message_body" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'mock',
    "provider_message_id" TEXT,
    "status" "WhatsappDeliveryStatus" NOT NULL DEFAULT 'QUEUED',
    "error_message" TEXT,
    "attempt_count" INTEGER NOT NULL DEFAULT 1,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whatsapp_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "whatsapp_logs_collection_task_id_idx" ON "whatsapp_logs"("collection_task_id");

-- CreateIndex
CREATE INDEX "whatsapp_logs_status_idx" ON "whatsapp_logs"("status");

-- AddForeignKey
ALTER TABLE "whatsapp_logs" ADD CONSTRAINT "whatsapp_logs_collection_task_id_fkey" FOREIGN KEY ("collection_task_id") REFERENCES "collection_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
