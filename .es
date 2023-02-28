const TEMPLATE = "/home/ward/c/quote/template";
const DATABASE = "/home/ward/c/quote/db";
connect('localhost', 'es', 'es', 'EconomicSeries00');

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
RC = (R1953 or R1957 or R1960 or R1969 or R1973 or R1980 or R1981 or R1990 or R2001 or R2007 or R2020);

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
NFCI = load(18);
RSAFS = load(37);
WILL5000 = load(5000);

# Market valuation metric VM
const K = 0.5;
const NR = 3.25; # neutral rate
DGS2 = load(24);
F = (E - E^K) * DGS2 / NR + E^K;
LOGF = log(F);
VM = 100 * LOGF * WILL5000 / GDP;
setName(VM, "VM");
setTitle(VM, "Market Valuation Metric");
setSource(VM, "[DERIVED]");
DESC = "Adjusts market valuation against interest rates\n\n" +
  "K=" + K + "\n" +
  "NR=" + NR;
setNotes(VM, DESC);
F = NULL;
LOGF = NULL;

RSAFS = load(37);
RSAFS.pc1 = pchange(RSAFS, 12);
setName(RSAFS.pc1, "RSAFS.pc1");
setTitle(RSAFS.pc1, getTitle(RSAFS) + ", YoY Percentage Change");
setNotes(RSAFS.pc1, getNotes(RSAFS));
setSource(RSAFS.pc1, "[DERIVED]");

SP500 = load(500);

