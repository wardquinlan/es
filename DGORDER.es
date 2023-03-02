DGORDER = load(27);
DGORDER.pc1 = pchange(DGORDER, 12);
LIMIT = 12;
DGORDER.pc1 = min(DGORDER.pc1, +LIMIT);
DGORDER.pc1 = max(DGORDER.pc1, -LIMIT);
setName(DGORDER.pc1, "DGORDER.pc1");
setTitle(DGORDER.pc1, getTitle(DGORDER) + ", YoY Percentage Change");
setNotes(DGORDER.pc1,
  "<strong>Note:</strong> I have capped durable goods percentage changes to +/- " + LIMIT + "%");
setSource(DGORDER.pc1, "[DERIVED]");

