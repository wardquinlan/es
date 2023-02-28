GDP = load(10);
GDP.pc1 = pchange(GDP, 4);
setName(GDP.pc1, "GDP.pc1");
setTitle(GDP.pc1, getTitle(GDP) + ", YoY Percentage Change");
setSource(GDP.pc1, "[DERIVED]");
setNotes(GDP.pc1, getNotes(GDP));

DT = date(GDP);
R1953 = DT >= '1953-07-01' and DT <= '1954-05-31';
R1957 = DT >= '1957-08-01' and DT <= '1958-04-30';
R1960 = DT >= '1960-04-01' and DT <= '1961-02-28';
R1969 = DT >= '1969-12-01' and DT <= '1970-11-30';
R1973 = DT >= '1973-11-01' and DT <= '1975-03-31';
R1980 = DT >= '1980-01-01' and DT <= '1980-07-31';
R1981 = DT >= '1981-07-01' and DT <= '1982-11-30';
R1990 = DT >= '1990-07-01' and DT <= '1991-03-31';
R2001 = DT >= '2001-03-01' and DT <= '2001-11-30';
R2007 = DT >= '2007-12-01' and DT <= '2009-06-30';
R2020 = DT >= '2020-02-01' and DT <= '2020-04-30';
#RC = (R1953 or R1957 or R1960 or R1969 or R1973 or R1980 or R1981 or R1990 or R2001 or R2007 or R2020);
RC = (R1969 or R1973 or R1980 or R1981 or R1990 or R2001 or R2007 or R2020);

DT = NULL;
R1953 = NULL;
R1957 = NULL;
R1960 = NULL;
R1969 = NULL;
R1973 = NULL;
R1980 = NULL;
R1981 = NULL;
R1990 = NULL;
R2001 = NULL;
R2007 = NULL;
R2020 = NULL;

setName(RC, "RC");
setTitle(RC, "NBER-defined Recessions");
setNotes(RC, "Source: https://www.nber.org/research/data/us-business-cycle-expansions-and-contractions");
setSource(RC, "NBER");

UMCSENT = load(31);
WILL5000 = load(5000);

const K = 0.5;
const NR = 3.25; # neutral rate
DGS2 = load(24);
F = (E - E^K) * DGS2 / NR + E^K;
LOGF = log(F);
MKCAPGDP = 100 * LOGF * WILL5000 / GDP;
setName(MKCAPGDP, "MKCAPGDP");
setTitle(MKCAPGDP, "Market Cap to GDP");
setSource(MKCAPGDP, "[DERIVED]");
DESC = "Adjusted Market Cap to GDP with:\n\n" +
  "K=" + K + "\n" +
  "NR=" + NR;
setNotes(MKCAPGDP, DESC);
F = NULL;

include "RSAFS.es";

SP500 = load(500);

DGORDER = load(27);
DGORDER.pc1 = pchange(DGORDER, 12);
setName(DGORDER.pc1, "DGORDER.pc1");
setTitle(DGORDER.pc1, getTitle(DGORDER) + ", YoY Percentage Change");
setSource(DGORDER.pc1, "[DERIVED]");

T10Y3M = load(117);
T10Y3M.inv = T10Y3M < 0;
setName(T10Y3M.inv, "T10Y3M.inv");
setTitle(T10Y3M.inv, getTitle(T10Y3M));
setNotes(T10Y3M.inv, getNotes(T10Y3M));
setSource(T10Y3M.inv, "[DERIVED]");

SP500_EPS_Q = load(512);
SP500_EPS = sum(SP500_EPS_Q, 4);
SP500_PE = LOGF * SP500 / SP500_EPS;

SP500_SALES_Q = load(510);
SP500_SALES = sum(SP500_SALES_Q, 4);
SP500_PS = LOGF * SP500 / SP500_SALES;

NFCI = load(18);

JTSJOL = load(77);
UNEMPLOY = load(57);
JU = JTSJOL / UNEMPLOY;
setName(JU, "JU");
setTitle(JU, "Job Openings / Unemployment");
setSource(JU, "[DERIVED]");

