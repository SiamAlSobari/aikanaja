-- CreateIndex
CREATE INDEX "ErdProject_userId_idx" ON "ErdProject"("userId");

-- CreateIndex
CREATE INDEX "ErdProject_status_idx" ON "ErdProject"("status");

-- CreateIndex
CREATE INDEX "ErdProject_userId_status_idx" ON "ErdProject"("userId", "status");

-- CreateIndex
CREATE INDEX "ErdShare_userId_idx" ON "ErdShare"("userId");

-- CreateIndex
CREATE INDEX "ErdShareLink_projectId_idx" ON "ErdShareLink"("projectId");

-- CreateIndex
CREATE INDEX "ErdTemplate_category_idx" ON "ErdTemplate"("category");

-- CreateIndex
CREATE INDEX "ErdVersion_projectId_idx" ON "ErdVersion"("projectId");

-- CreateIndex
CREATE INDEX "ErdVersion_projectId_createdAt_idx" ON "ErdVersion"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_userId_status_idx" ON "Payment"("userId", "status");
