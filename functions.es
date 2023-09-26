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
  if (getSource(series) == 'FRED') {
    METRICS.numberOfSeries = METRICS.numberOfSeries + 1;
    METRICS.numberOfRecords = METRICS.numberOfRecords + getSize(series);
  }
}

function reportSeriesUsage() {
  cat(seriesUsageMetrics);
  print('Series Metrics');
  print('--------------');
  print('Series loaded in catalog: ' + METRICS.numberOfSeries);
  print('Total number of records in catalog: ' + METRICS.numberOfRecords);
}

