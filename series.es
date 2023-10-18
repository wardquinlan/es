function reload() {
  log(INFO, 'loading series from datastore...');
  ds(autoload);
  createRC();
  createPC1(GDP, 4);
  createInv(T10Y3M);
  createInv(T10Y2Y);
  #createSP500(DGS2);
  createSP500(DGS10);
  createJU();
  createPC1WithLimit(RSAFS, 12, 12);
  createPC1(PCEPILFE, 12);
  createPC1WithLimit(PCEDG, 12, 12);
  createPC1WithLimit(PCES, 12, 12);
  createPC1WithLimit(DGORDER, 12, 12);
  createVIX();
  createPC1WithLimit(PPIACO, 12, 12);
  createDGS1FC();
  createWALCL();
  createICSA();
}

function p1(obj) {
  if (getType(obj) == 'String' and obj  == 'undefined') {
    throw 'usage: p1(obj);';
  }
  if (getType(obj) == 'int' or getType(obj) == 'String') {
    obj = load(obj);
  }
  defaults.panel.dxincr = 1;
  defaults.panel.frequency = MONTHS;
  plot(obj);
}

function p2(obj) {
  if (getType(obj) == 'String' and obj  == 'undefined') {
    throw 'usage: p1(obj);';
  }
  if (getType(obj) == 'int' or getType(obj) == 'String') {
    obj = load(obj);
  }
  defaults.panel.dxincr = 16;
  defaults.panel.frequency = MONTHS;
  plot(obj);
}

function pf1(name) {
  if (getType(name) != 'String' or name == 'undefined') {
    throw 'usage: pf(name);';
  }
  series = fred(name);
  defaults.panel.dxincr = 1;
  defaults.panel.frequency = MONTHS;
  plot(series);
}

function pf2(name) {
  if (getType(name) != 'String' or name == 'undefined') {
    throw 'usage: pf(name);';
  }
  series = fred(name);
  defaults.panel.dxincr = 16;
  defaults.panel.frequency = MONTHS;
  plot(series);
}

function sp500(value) {
  S = load(500);
  D = date(S);
  if (get(D, getSize(D) - 1) < today()) {
    insert(S, today(), value);
    merge(S, '--with-inserts');
  }
}

function view() {
  if (!defined('DFF')) {
    reload();
    assert(defined('DFF'), 'DFF not loaded');
  }
  plot('es.xml');
}

function logf(series, r) {
  F = (E - E^LOGF.K) * r / LOGF.NR + E^LOGF.K;
  return ln(F) * series;
}

function summary() {
  if (!defined('DFF')) {
    reload();
    assert(defined('DFF'), 'DFF not loaded');
  }
  print('');
  summarize(SP500);
  summarize(DGS10);
  summarize(DGS2);
  summarize(DTB3);
  summarize(RRPONTSYD);
}

function summarize(series) {
  print(getTitle(series));
  print('[' + last(date(series)) + ']');
  print('' + last(series) + ' => ' + last(change(series)));
  print();
}

function createRC() {
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
  RC = (R1969 or R1973 or R1980 or R1981 or R1990 or R2001 or R2007 or R2020);
  setName(RC, 'RC');
  setTitle(RC, 'NBER-defined Recessions');
  setNotes(RC, 'Source: https://www.nber.org/research/data/us-business-cycle-expansions-and-contractions');
  setSource(RC, 'NBER');
  gPut('RC', RC);
} 

function createInv(base) {
  series = base < 0;
  setName(series, getName(base) + '.inv');
  setTitle(series, getTitle(base));
  setSource(series, '[DERIVED]');
  setNotes(series, getNotes(base));
  gPut(getName(series), series);
}

function createPC1(base, freq) {
  series = pchange(base, freq);
  setName(series, getName(base) + '.pc1');
  setTitle(series, getTitle(base) + ' (YoY Percentage Change)');
  setSource(series, '[DERIVED]');
  setNotes(series, getNotes(base));
  gPut(getName(series), series);
}

function createPC1WithLimit(base, freq, limit) {
  series = pchange(base, freq);
  series = min(series, +limit);
  series = max(series, -limit);
  setName(series, getName(base) + '.pc1');
  setTitle(series, getTitle(base) + ' (YoY Percentage Change)');
  setSource(series, '[DERIVED]');
  setNotes(series,
    '<strong>Note:</strong> I have capped percentage changes to +/- ' + limit +
    '%\n\n' + getNotes(base));
  gPut(getName(series), series);
}

function createSP500(r) {
  SP500_EPS = sum(SP500_EPS_Q, 4);
  SP500_SALES = sum(SP500_SALES_Q, 4);

  SP500_PE = logf(SP500 / SP500_EPS, r);
  setName(SP500_PE, 'SP500_PE');
  setTitle(SP500_PE, 'Adjusted SP500 Price / Earnings');
  setSource(SP500_PE, '[DERIVED]');

  SP500_PS = logf(SP500 / SP500_SALES, r);
  setName(SP500_PS, 'SP500_PS');
  setTitle(SP500_PS, 'Adjusted SP500 Price / Sales');
  setSource(SP500_PS, '[DERIVED]');

  SP500_EY = SP500_EPS / SP500 * 100;
  setName(SP500_EY, 'SP500_EY');
  setTitle(SP500_EY, 'S&P 500 Earnings Yield (Unadjusted)');
  setSource(SP500_EY, '[DERIVED]');

  MKCAPGDP = 100 * logf(WILL5000PRFC / GDP, r);
  setName(MKCAPGDP, 'MKCAPGDP');
  setTitle(MKCAPGDP, 'Market Cap to GDP');
  setSource(MKCAPGDP, '[DERIVED]');
  DESC = 'Adjusted Market Cap to GDP with:\n\n' +
    'K=' + LOGF.K + '\n' +
    'NR=' + LOGF.NR;
  setNotes(MKCAPGDP, DESC);

  gPut(getName(SP500_PE), SP500_PE);
  gPut(getName(SP500_PS), SP500_PS);
  gPut(getName(SP500_EY), SP500_EY);
  gPut(getName(MKCAPGDP), MKCAPGDP);
}

function createJU() {
  JU = JTSJOL / UNEMPLOY;
  setName(JU, 'JU');
  setTitle(JU, 'Job Openings / Unemployment');
  setSource(JU, '[DERIVED]');
  gPut(getName(JU), JU);
}

function createVIX() {
  VIXCLS.H = VIXCLS > 36;
  setName(VIXCLS.H, 'VIXCLS.H');
  setTitle(VIXCLS.H, getTitle(VIXCLS));
  setSource(VIXCLS.H, '[DERIVED]');
  setNotes(VIXCLS.H, 'Condition is true when VIXCLS > 36');
  gPut(getName(VIXCLS.H), VIXCLS.H);
}

function createDGS1FC() {
  DGS1.fc = (100 + DGS2)^2 / (100 + DGS1) - 100;
  setName(DGS1.fc, 'DGS1.fc');
  setTitle(DGS1.fc, '1-year DGS1 Forecasted Rate');
  setSource(DGS1.fc, '[DERIVED]');
  gPut(getName(DGS1.fc), DGS1.fc);
}

function createWALCL() {
  X = WALCL;
  WALCL = X / 1000;
  setName(WALCL, 'WALCL');
  setTitle(WALCL, getTitle(X));
  setSource(WALCL, getSource(X));
  setSource(WALCL, getSourceId(X));
  setNotes(WALCL, 'Units are in Billions of US Dollars');
}

function createICSA() {
  X = ICSA;
  ICSA = min(600, X / 1000);
  setName(ICSA, 'ICSA');
  setTitle(ICSA, getTitle(X));
  setSource(ICSA, getSource(X));
  setSourceId(ICSA, getSourceId(X));
  setNotes(ICSA, 'Units: Thousands\n\n' + getNotes(X));
}


