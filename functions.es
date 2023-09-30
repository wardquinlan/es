. 'constants.es';

function autoload(series) {
  # don't load the backups...
  if (getId(series) < 10000) {
    # need to load data
    series = load(getId(series)); 
    name = getName(series);
    gPut(name, series);
  } 
} 
  
function logf(series, r) {
  F = (E - E^LOGF.K) * r / LOGF.NR + E^LOGF.K;
  return ln(F) * series;
}

function backup(id) {
  if (!isAdmin()) {
    throw 'you must be running in administrative mode to do backups';
  }
  if (!defined('id')) {
    throw 'usage: backup(series-id)';
  }
  print('backuping up series ' + id + '...');
  S = load(id);
  setName(S, getName(S) + '.orig');
  setId(S, getId(S) + 10000);
  setSource(S, getSource(S) + '.orig');
  print('backup series name = ' + getName(S));
  print('backup series id = ' + getId(S));
  save(S);
}

function updateFred(series) {
  if (getSource(series) == 'FRED') {
    id = getId(series);
    name = getName(series);
    log(INFO, 'updating ' + id + ':' + name + '...');
    series = fred(name);
    setId(series, id);
    merge(series, '--with-inserts');
  }
}

function metrics(series) {
  S = load(getId(series));
  METRICS.numberOfSeries = METRICS.numberOfSeries + 1;
  METRICS.numberOfRecords = METRICS.numberOfRecords + getSize(S);
  print(getName(S) + ': ' + getSize(S));
}

function usage() {
  gPut('METRICS.numberOfSeries', 0);
  gPut('METRICS.numberOfRecords', 0);
  print('Series Metrics');
  print('--------------');
  ds(metrics);
  print('');
  print('Series stored in datastore: ' + METRICS.numberOfSeries);
  print('Number of records stored in datastore: ' + METRICS.numberOfRecords);
}

function last(series) {
  if (getSize(series) == 0) {
    throw getName(series) + ': no data';
  }
  D = date(series);
  C = change(series);
  assert(getSize(series) == getSize(D), 'original series and date series are not consistent');
  assert(getSize(series) == getSize(C) + 1, 'original series and change series are not consistent');
  print(get(D, getSize(D) - 1) + ': ' + get(series, getSize(series) - 1) + ' (change = ' + get(C, getSize(C) - 1) + ')');
}

function summary() {
  print('--------------------');
  print('S&P 500:');
  last(SP500);
  println();
  print('10-year Treasury:');
  last(DGS10);
  println();
  print('2-year Treasury:');
  last(DGS2);
  println();
  print('3-Month Treasury:');
  last(DTB3);
  println();
}

function println() {
  print('');
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
    "<strong>Note:</strong> I have capped percentage changes to +/- " + limit +
    "%\n\n" + getNotes(base));
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
  setName(JU, "JU");
  setTitle(JU, "Job Openings / Unemployment");
  setSource(JU, "[DERIVED]");
  gPut(getName(JU), JU);
}

function createVIX() {
  VIXCLS.H = VIXCLS > 36;
  setName(VIXCLS.H, "VIXCLS.H");
  setTitle(VIXCLS.H, getTitle(VIXCLS));
  setSource(VIXCLS.H, "[DERIVED]");
  setNotes(VIXCLS.H, "Condition is true when VIXCLS > 36");
  gPut(getName(VIXCLS.H), VIXCLS.H);
}

function createDGS1FC() {
  DGS1.fc = (100 + DGS2)^2 / (100 + DGS1) - 100;
  setName(DGS1.fc, "DGS1.fc");
  setTitle(DGS1.fc, "1-year DGS1 Forecasted Rate");
  setSource(DGS1.fc, "[DERIVED]");
  gPut(getName(DGS1.fc), DGS1.fc);
}

