PPIACO = load(47);
PPIACO.pc1 = pchange(PPIACO, 12);
LIMIT = 12;
PPIACO.pc1 = min(PPIACO.pc1, +LIMIT);
PPIACO.pc1 = max(PPIACO.pc1, -LIMIT);
setName(PPIACO.pc1, "PPIACO.pc1");
setTitle(PPIACO.pc1, getTitle(PPIACO) + ", YoY Percentage Change");
setNotes(PPIACO.pc1, 
  "<strong>Note:</strong> I have capped producer price index percentage changes to +/- " + LIMIT + "%");
setSource(PPIACO.pc1, "[DERIVED]");

