function updateFredSeries(series) {
  if (getSource(series) == 'FRED') {
    id = getId(series);
    name = getName(series);
    print('updating ' + id + ":" + name + '...');
    series = fred(name);
    setId(series, id);
    merge(series, '--with-inserts');
  }
}

