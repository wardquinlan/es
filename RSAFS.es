RSAFS = load(37);
RSAFS.pc1 = pchange(RSAFS, 12);
setName(RSAFS.pc1, "RSAFS.pc1");
setTitle(RSAFS.pc1, getTitle(RSAFS) + ", YoY Percentage Change");
setNotes(RSAFS.pc1, getNotes(RSAFS));
setSource(RSAFS.pc1, "[DERIVED]");

