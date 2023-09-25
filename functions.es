print('loading functions...');

# Updates a series
# - name: the series name
#
# returns: null

function up(name) {
  print('updating ' + name + '...');
  id = getId(load(name));
  print('found id= ' + id);
  series = fred(name);
  setId(series, id);
  merge(series, '--with-inserts', '--dry-run');
}

