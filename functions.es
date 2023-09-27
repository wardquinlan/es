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

function reportSeriesUsage() {
  print('Series Metrics');
  print('--------------');
  ds(seriesUsageMetrics);
  print('');
  print('Series loaded in datastore: ' + METRICS.numberOfSeries);
  print('Total number of records in datastore: ' + METRICS.numberOfRecords);
}

function last(series) {
  if (getSize(series) == 0) {
    throw getName(series) + ': no data';
  }
  D = date(series);
  cf(getSize(series) == getSize(D), 'original series and date series are not the same size');
  print(get(D, getSize(D) - 1) + ': ' + get(series, getSize(series) - 1));
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
}

