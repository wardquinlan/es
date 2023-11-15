include 'model.es';

function model() {
  M:Run('BASIC QUARTERLY REALLOC MODEL', 'Q', 1995, 1, 116, true);
  :GPut('MODEL2', RESULTS);
}

