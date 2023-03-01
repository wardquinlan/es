include "LOGF.es";
include "GDP.es";
include "RC.es";


WILL5000 = load(5000);
MKCAPGDP = 100 * LOGF * WILL5000 / GDP;
setName(MKCAPGDP, "MKCAPGDP");
setTitle(MKCAPGDP, "Market Cap to GDP");
setSource(MKCAPGDP, "[DERIVED]");
DESC = "Adjusted Market Cap to GDP with:\n\n" +
  "K=" + K + "\n" +
  "NR=" + NR;
setNotes(MKCAPGDP, DESC);

include "RSAFS.es";
include "DGORDER.es";
include "T10Y3M.es";
include "SP500.es";
include "JU.es";

NFCI = load(18);

UMCSENT = load(31);

