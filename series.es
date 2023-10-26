function reload() {
  log(INFO, 'loading series from datastore...');
  ds(ES:AutoLoad);
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

# generic function to plot a stand-alone object
function p(obj) {
  if (getType(obj) == 'int') {
    if (!exists(obj)) {
      throw '' + obj + ' does not exist in the datastore';
    }
    log(INFO, 'loading ' + obj + ' from the datastore...');
    obj = load(obj);
  } else if (getType(obj) == 'String') {
    if (exists(obj)) {
      log(INFO, 'loading ' + obj + ' from the datastore...');
      obj = load(obj);
    } else {
      log(INFO, 'attempting to download ' + obj + ' from FRED...');
      obj = fred(obj);
    }
  }
  if (getFrequencyShort(obj) == 'D') {
    defaults.panel.dxincr = 1;
    defaults.panel.frequency = MONTHS;
  } else if (getFrequencyShort(obj) == 'W') {
    defaults.panel.dxincr = 8;
    defaults.panel.frequency = MONTHS;
  } else if (getFrequencyShort(obj) == 'M') {
    defaults.panel.dxincr = 18;
    defaults.panel.frequency = MONTHS;
  } else if (getFrequencyShort(obj) == 'Q') {
    defaults.panel.dxincr = 18;
    defaults.panel.frequency = MONTHS;
  } 
  plot(obj);
}

function input() {
  n = dlgInput('Enter the series number:');
  if (n == null) {
    return;
  }
  id = parseInt(n);
  if (id == null) {
    dlgMessage('Series number must be an int', ERROR);
    return;
  }
  
  d = dlgInput('Enter the date:');
  if (d == null) {
    return;
  }

  v = dlgInput('Enter the value:');
  if (v == null) {
    return;
  }
  v = parseFloat(v);
  if (v == null) {
    dlgMessage('Value must be a float', ERROR);
    return;
  }
  
  S = load(id);
  message = 'updating ' + getName(S) + ':' + id + ' on ' + d + ' with ' + v;
  if (!dlgConfirm(message)) {
    return;
  }

  insert(S, d, v);
  merge(S, '--with-inserts', '--dry-run');
  dlgMessage(getName(S) + ' has been merged');
}

function sp500() {
  value = dlgInput('Enter today\'s value of SP500:');
  if (value == null) {
    return;
  }
  value = parseFloat(value);
  if (value == null) {
    dlgMessage('Value must be a float', ERROR);
    return; 
  }

  S = load(500);
  D = date(S);
  if (get(D, getSize(D) - 1) < today()) {
    insert(S, today(), value);
    merge(S, '--with-inserts');
    dlgMessage('SP500 has been merged');
    return;
  }
  dlgMessage('SP500 already has a value for that date');
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

function last(series) {
  series = loadSeries(series);
  return get(series, getSize(series) - 1);
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
  series = ES:PChange(base, freq);
  setName(series, getName(base) + '.pc1');
  setTitle(series, getTitle(base) + ' (YoY Percentage Change)');
  setSource(series, '[DERIVED]');
  setNotes(series, getNotes(base));
  gPut(getName(series), series);
}

function createPC1WithLimit(base, freq, limit) {
  series = ES:PChange(base, freq);
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
  X = WALCL / 1000;
  setName(X, getName(WALCL));
  setTitle(X, getTitle(WALCL));
  setSource(X, getSource(WALCL));
  setSource(X, getSourceId(WALCL));
  setUnits(X, 'Billions of Dollars');
  setUnitsShort(X, 'Bil. of $');
  setNotes(X, getNotes(WALCL));
  gPut('WALCL', X);
}

function createICSA() {
  X = min(600, ICSA / 1000);
  setName(X, getName(ICSA));
  setTitle(X, getTitle(ICSA));
  setSource(X, getSource(ICSA));
  setSourceId(X, getSourceId(ICSA));
  setUnits(X, 'Level in Thousands');
  setUnitsShort(X, 'Level in Thous.');
  setNotes(X, getNotes(ICSA));
  gPut('ICSA', X);
}

# updates units / frequency fields from Fred (runs as a callback)
function uf(series) {
  if (!isAdmin()) {
    throw 'you must be running in administrative mode to do this';
  }
  response = dlgConfirm('!!! Are you absolutely sure you want to update this series\' units and frequency?');
  if (!response) {
    return;
  }
  throw '*** you probably don\'t want to this...';

  name = getName(series);
  log(INFO, 'consolidating ' + name);
  if (getSource(series) != 'FRED' or getId(series) >= 10000) {
    log(INFO, 'skipping ' + name);
    return;
  }
  F = fred(getName(series));
  setUnits(series, getUnits(F));
  setUnitsShort(series, getUnitsShort(F));
  setFrequency(series, getFrequency(F));
  setFrequencyShort(series, getFrequencyShort(F));
  log(INFO, getUnits(series) + ':' + getUnitsShort(series));
  log(INFO, getFrequency(series) + ':' + getFrequencyShort(series));
  merge(series, '--with-metadata');
}

