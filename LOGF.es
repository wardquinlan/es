const K = 0.5;
const NR = 3.25; # neutral rate
DGS2 = load(24);
F = (E - E^K) * DGS2 / NR + E^K;
LOGF = ln(F);
setName(LOGF, "LOGF");
setTitle(LOGF, "Interest Rate Adjusted scaling factor");
setSource(LOGF, "[DERIVED]");
setNotes(LOGF, "Defined as:\n  ln((E - E^K) * DGS2 / NR + E^K)\n\nWith:\n  K=" + K + "\n  NR=" + NR);
F = NULL;

