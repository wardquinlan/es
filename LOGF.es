#const K = 0.5;
#const NR = 3.25; # neutral rate
#F = (E - E^K) * DGS2 / NR + E^K;
#LOGF = ln(F);
#setName(LOGF, "LOGF");
#setTitle(LOGF, "Interest Rate Adjusted scaling factor");
#setSource(LOGF, "[DERIVED]");
#setNotes(LOGF, "Defined as:\n  ln((E - E^K) * DGS2 / NR + E^K)\n\nWith:\n  K=" + K + "\n  NR=" + NR);
#F = NULL;

# LOGF Model
const LOGF.K = 0.5;   # scaling factor
const LOGF.NR = 3.25; # neutral rate
const LOGF.R = DGS2;  # base interest rate

function logf(series) {
  F = (E - E^LOGF.K) * LOGF.R / LOGF.NR + E^LOGF.K;
  return ln(F) * series;
}

