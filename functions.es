## we probably want to replace this with confirm() which actually asks the user for input
## And then, rename this function to assert().  And then, remove the assert() command.

function cf(cond, message) {
  if (!cond) {
    throw '*** CONFIRMATION FAILED: ' + message;
  }
}

function m(object) {
  meta(object);
}

function d(object) {
  data(object);
}

function println() {
  print('');
}

function s() {
  summary();
}

function backup(id, idNew) {
  if (!isAdmin()) {
    throw 'you must be running in administrative mode to run this function';
  }
  print('backuping up series ' + id + '...');
  S = load(id);
  setId(S, idNew);
  setName(S, getName(S) + '.orig');
  save(S);
}

function updateFredSeries(series) {
  if (getSource(series) == 'FRED') {
    id = getId(series);
    name = getName(series);
    log(INFO, 'updating ' + id + ":" + name + '...');
    series = fred(name);
    setId(series, id);
    merge(series, '--with-inserts');
  }
}

METRICS.numberOfSeries = 0;
METRICS.numberOfRecords = 0;
function seriesUsageMetrics(series) {
  S = load(getId(series));
  METRICS.numberOfSeries = METRICS.numberOfSeries + 1;
  METRICS.numberOfRecords = METRICS.numberOfRecords + getSize(S);
  print(getName(S) + ': ' + getSize(S));
}

function usage() {
  print('Series Metrics');
  print('--------------');
  ds(seriesUsageMetrics);
  print('');
  print('Series stored in datastore: ' + METRICS.numberOfSeries);
  print('Total number of records store in datastore: ' + METRICS.numberOfRecords);
}

function last(series) {
  if (getSize(series) == 0) {
    throw getName(series) + ': no data';
  }
  D = date(series);
  C = change(series);
  cf(getSize(series) == getSize(D), 'original series and date series are not consistent');
  cf(getSize(series) == getSize(C) + 1, 'original series and change series are not consistent');
  print(get(D, getSize(D) - 1) + ': ' + get(series, getSize(series) - 1) + ' (change = ' + get(C, getSize(C) - 1) + ')');
}

function summary() {
  print('S&P 500:');
  last(SP500);
  println();
  print('3-Month Treasury:');
  last(DTB3);
  println();
  print('2-year Treasury:');
  last(DGS2);
  println();
  print('10-year Treasury:');
  last(DGS10);
  println();
  print('RRP:');
  last(RRPONTSYD);
  println();
  print('WALCL:');
  last(WALCL);
  println();
}

