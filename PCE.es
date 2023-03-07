PCEPILFE = load(53);
PCEPILFE.pc1 = pchange(PCEPILFE, 12);
setName(PCEPILFE.pc1, "PCEPILFE.pc1");
setTitle(PCEPILFE.pc1, getTitle(PCEPILFE) + ", YoY Percentage Change");
setSource(PCEPILFE.pc1, "[DERIVED]");
setNotes(PCEPILFE.pc1, getNotes(PCEPILFE));

LIMIT = 12;

PCEDG = load(108);
PCEDG.pc1 = pchange(PCEDG, 12);
PCEDG.pc1 = min(PCEDG.pc1, +LIMIT);
PCEDG.pc1 = max(PCEDG.pc1, -LIMIT);
setName(PCEDG.pc1, "PCEDG.pc1");
setTitle(PCEDG.pc1, getTitle(PCEDG) + ", YoY Percentage Change");
setSource(PCEDG.pc1, "[DERIVED]");
setNotes(PCEDG.pc1, getNotes(PCEDG) + "\n\n" + "[capped to +/- " + LIMIT + "%]");

PCES = load(109);
PCES.pc1 = pchange(PCES, 12);
PCES.pc1 = min(PCES.pc1, +LIMIT);
PCES.pc1 = max(PCES.pc1, -LIMIT);
setName(PCES.pc1, "PCES.pc1");
setTitle(PCES.pc1, getTitle(PCES) + ", YoY Percentage Change");
setSource(PCES.pc1, "[DERIVED]");
setNotes(PCES.pc1, getNotes(PCES) + "\n\n" + "[capped to +/- " + LIMIT + "%]");

