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
  const LOGF.K = 0.5;   # scaling factor
  const LOGF.NR = 3.25; # neutral rate
  
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
    log(INFO, 'updating ' + id + ":" + name + '...');
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
  gPut(METRICS.numberOfSeries, 0);
  gPut(METRICS.numberOfRecords, 0);
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
  setTitle(RC, "NBER-defined Recessions");
  setNotes(RC, "Source: https://www.nber.org/research/data/us-business-cycle-expansions-and-contractions");
  setSource(RC, "NBER");
  return RC;
} 

function println() {
  print('');
}

