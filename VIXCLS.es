VIXCLS = load(23);
VIXCLS.H = VIXCLS > 36;
setName(VIXCLS.H, "VIXCLS.H");
setTitle(VIXCLS.H, getTitle(VIXCLS));
setSource(VIXCLS.H, "[DERIVED]");
setNotes(VIXCLS.H, "Condition is true when VIXCLS > 36");
