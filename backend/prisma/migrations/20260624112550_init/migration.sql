-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cron_expression" TEXT,
    "next_run_time" DATETIME,
    "catch_up_strategy" TEXT NOT NULL DEFAULT 'SKIP',
    "nodes_config" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ExecutionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workflow_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "trigger_time" DATETIME NOT NULL,
    "completed_at" DATETIME,
    "log_details" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExecutionLog_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "Workflow" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
