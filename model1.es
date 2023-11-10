TOTAL = 100000;
HEDGE_FACTOR = 0.33;

BASE_X2 = HEDGE_FACTOR * TOTAL;
BASE_SPRIME = TOTAL - BASE_X2;

function simulation(year) {
  SP500 = ES:Load(500);
  date1 = ES:ToString(year - 1) + '-04-01';
  date2 = ES:ToString(year) + '-03-31';
  S = ES:Chop(SP500, date1, date2);
  SPRIME = ES:Scale(S, -1);
  SX2 = ES:Scale(S, 2);

  N = :GetSize(SPRIME);

  PROFIT1 = BASE_SPRIME * (:Get(SPRIME, N - 1) - :Get(SPRIME, 0)) / :Get(SPRIME, 0);
  #print('PROFIT1 = ' + PROFIT1);
  PROFIT2 = BASE_X2 * (:Get(SX2, N - 1) - :Get(SX2, 0)) / :Get(SX2, 0);
  NET = PROFIT1 + PROFIT2;
  NETPCT = (PROFIT1 + PROFIT2) * 100 / TOTAL;
  #print('PROFIT2 = ' + PROFIT2);

  #print('Total return = ' + (PROFIT1 + PROFIT2));
  #print('Total return = ' + (PROFIT1 + PROFIT2) * 100.0 / TOTAL + '%');

  printf('%12d  $%12.2f  $%12.2f  $%12.2f   %.0f%%\n', year, PROFIT1, PROFIT2, NET, NETPCT);
}

printf('%12s   %12s   %12s   %12s   %s%%\n', 'YEAR', 'SPRIME', 'SINV', 'NET', 'NET');
print();
for (year = 1996; year <= 2024; year++) {
  simulation(year);
}

