const K = 0.5;
const NR = 3.25; # neutral rate
DGS2 = load(24);
F = (E - E^K) * DGS2 / NR + E^K;
LOGF = log(F);
F = NULL;

