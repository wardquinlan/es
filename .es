include "functions.es";
include "LOGF.es";
include "GDP.es";
include "RC.es";
include "MKCAPGDP.es";
include "RSAFS.es";
include "DGORDER.es";
include "T10Y3M.es";
include "SP500.es";
include "JU.es";
include "PCE.es";
include "DGORDER.es";
include "PPIACO.es";
include "VIXCLS.es";
include "DGS.es";
include "WALCL.es";

NFCI = load(18);
UMCSENT = load(31);
MICH = load(29);
T5YIE = load(83);
T10YIE = load(84);
PMI.M = load(173);
PMI.NM = load(176);
OECDCLI = load(87);
BAA10Y = load(14);
BAMLC0A0CM = load(58);
RRPONTSYD = load(61);
RRPONTSYAWARD = load(62);

TMP = load(91);
# cap to 600
ICSA = min(600, TMP / 1000);
# A bit dangerous, so I won't do this:
# setId(ICSA, 91);
setName(ICSA, "ICSA");
setTitle(ICSA, "Initial Claims");
setSource(ICSA, "FRED");
setSourceId(ICSA, "ICSA");
setNotes(ICSA, "Units: Thousands\n\n" + getNotes(TMP));

# can't do this: will screw up cron jobs
# plot('es.xml');

