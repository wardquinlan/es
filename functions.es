print('loading functions...');

# Updates a series
# - id  : the series id
# - name: the series name
# returns: null
function upd(id, name) {
  series = fred(name);
  setId(series, id);
  merge(series, '--with-inserts');
}

