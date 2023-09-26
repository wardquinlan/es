function updateFredSeries(series) {
  if (getSource(series) == 'FRED') {
    name = getName(series);
    print('updating ' + name + '...');
    id = getId(load(name));
    series = fred(name);
    setId(series, id);
    merge(series, '--with-inserts');
  }
}

