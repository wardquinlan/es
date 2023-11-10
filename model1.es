BASE_SPRIME = 80000;
BASE_X2 = 20000;

function simulation(year) {
  SP500 = ES:Load(500);
  date1 = ES:ToString(year - 1) + '-04-01';
  date2 = ES:ToString(year) + '-03-31';
  S = ES:Chop(SP500, date1, date2);
  SPRIME = ES:Scale(S, -1);
  SX2 = ES:Scale(S, 2);

  TOTAL = BASE_SPRIME + BASE_X2;

  N = :GetSize(SPRIME);

  PROFIT1 = BASE_SPRIME * (:Get(SPRIME, N - 1) - :Get(SPRIME, 0)) / :Get(SPRIME, 0);
  #print('PROFIT1 = ' + PROFIT1);
  PROFIT2 = BASE_X2 * (:Get(SX2, N - 1) - :Get(SX2, 0)) / :Get(SX2, 0);
  NET = PROFIT1 + PROFIT2;
  NETPCT = (PROFIT1 + PROFIT2) * 100 / TOTAL;
  #print('PROFIT2 = ' + PROFIT2);

  #print('Total return = ' + (PROFIT1 + PROFIT2));
  #print('Total return = ' + (PROFIT1 + PROFIT2) * 100.0 / TOTAL + '%');

  printf('%10d  %10.2f  %10.2f  $%10.2f  %.0f%%\n', year, PROFIT1, PROFIT2, NET, NETPCT);
}

printf('%10s  %10s  %10s  %10s  %s%%\n', 'YEAR', 'SPRIME', 'SINV', 'NET', 'NET%');
print();
for (year = 1996; year <= 2024; year++) {
  simulation(year);
}

