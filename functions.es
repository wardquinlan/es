function autoload(series) {
  # don't load the backups...
  if (getId(series) < 10000) {
    # need to load data
    series = load(getId(series)); 
    name = getName(series);
    gPut(name, series);
  } 
} 
  
function reset(id, idNew) {
  if (!isAdmin()) {
    throw 'you must be running in administrative mode to reset id\'s';
  }
  if (!defined('id') or !defined('idNew')) {
    throw 'usage: reset(id, idNew)';
  }
  if (exists(idNew)) {
    throw 'series already exists: ' + idNew;
  } 
  S = load(id);
  setId(S, idNew);
  drop(id);
  save(S);
}

function backup(id) {
  if (!isAdmin()) {
    throw 'you must be running in administrative mode to do backups';
  }
  if (!defined('id')) {
    throw 'usage: backup(id)';
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

function updateSeries(series) {
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
  if (getId(series) < 10000) {
    S = load(getId(series));
    METRICS.numberOfSeries = METRICS.numberOfSeries + 1;
    METRICS.numberOfRecords = METRICS.numberOfRecords + getSize(S);
    print(getName(S) + ': ' + getSize(S));
  }
}

function usage() {
  gPut('METRICS.numberOfSeries', 0);
  gPut('METRICS.numberOfRecords', 0);
  print('Series Metrics');
  print('--------------');
  ds(metrics);
  print('');
  print('Series stored in datastore: ' + METRICS.numberOfSeries + ' (excluding backup series)');
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

