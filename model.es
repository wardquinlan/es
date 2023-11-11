function getDateIndex(date, series) {
  D = :Date(series);
  for (i = 0; i < :GetSize(series); i++) {
    if (:Get(D, i) >= date) {
      return i;
    }
  }
  return null;
}

function createdScaledSeries(series, scale) {
  
  for (i = 1; i < :GetSize(series); i++) {
    rawScale = (:Get(series, i) - :Get(series, i - 1)) / :Get(series, i - 1);
  }
}

function createHSU(date) {
  BASE = 0;
  S = ES:Load(500);
  D = :Date(S);
  # look for 'date'
  for (i = 0; i < :GetSize(D); i++) {
    if (:Get(D, i) >= date) {
      print('found date ' + :Get(D, i) + ' at index: ' + i);
      BASE = i;
      break;
    }
  }

  HSU = :Create('HSU');
  :Insert(HSU, :Get(D, BASE), :Get(S, BASE));

  for (i = BASE + 1; i < :GetSize(S); i++) {
    #print('S: ' + :Get(S, i));
    scale = 2 * (:Get(S, i) - :Get(S, i - 1)) / :Get(S, i - 1);
    #:Printf("%20f%20f\n", :Get(S, i), (1 + scale) * :Get(HSU, i - BASE - 1));
    :Insert(HSU, :Get(D, i), (1 + scale) * :Get(HSU, i - BASE - 1));
  }
  return HSU;
}

date = :DlgInput('Enter the BASE date:');
if (date == null) {
  return;
}
HSU = createHSU(date);

