CASH_ASSETS = 212000.0;
DURATION_ASSETS = 62000.0;
INVERSE_ASSETS = 126000.0;
HEDGED_ASSETS = 9000.0;
TOTAL_ASSETS = CASH_ASSETS + DURATION_ASSETS + INVERSE_ASSETS + HEDGED_ASSETS;

HEDGE_FACTOR = HEDGE_ASSETS / INVERSE_ASSETS;
HEDGE_SCALE = 1.3;

DAY_START = '04-01';
DAY_END = '03-31';

function simulation(year) {
  date1 = ES:ToString(year - 1) + '-' + DAY_START;
  date2 = ES:ToString(year) + '-' + DAY_END;
  SP500 = ES:Load(500);
  DTB3 = ES:Load(3);

  S = ES:Chop(SP500, date1, date2);
  INVERSE = ES:Scale(S, -1);
  HEDGE = ES:Scale(S, HEDGE_SCALE);
  ES:Assert(:GetSize(S) == :GetSize(INVERSE));
  ES:Assert(:GetSize(S) == :GetSize(HEDGE));
  N = :GetSize(S);
  PROFIT_INVERSE = INVERSE_ASSETS * (:Get(INVERSE, N - 1) - :Get(INVERSE, 0)) / :Get(INVERSE, 0);
  PROFIT_HEDGE = HEDGE_ASSETS * (:Get(HEDGE, N - 1) - :Get(HEDGE, 0)) / :Get(HEDGE, 0);

  CASH = ES:Chop(DTB3, date1, date2);
  CASH_YIELD = :Get(ES:Chop(DTB3, date1, date2), 0) / 100;
  PROFIT_CASH = CASH_ASSETS * CASH_YIELD;

  PROFIT_NET = PROFIT_INVERSE + PROFIT_HEDGE + PROFIT_CASH;
  PROFIT_NET_PCT = 100 * PROFIT_NET / TOTAL_ASSETS;

  printf('%12d  $%12.2f  $%12.2f  $%12.2f  $%12.2f  %12.0f%%\n', 
           year, 
           PROFIT_INVERSE, 
           PROFIT_HEDGE, 
           PROFIT_CASH, 
           PROFIT_NET,
           PROFIT_NET_PCT);
}

print('Asset Model');
print('-----------');
printf('Cash Assets     : $%12.2f\n', CASH_ASSETS);
printf('Duration Assets : $%12.2f\n', DURATION_ASSETS);
printf('Inverse Assets  : $%12.2f\n', INVERSE_ASSETS);
printf('Hedged Assets   : $%12.2f\n', HEDGED_ASSETS);
printf('Total Assets    : $%12.2f\n', TOTAL_ASSETS);
print();

printf('%12s   %12s   %12s   %12s   %12s   %12s\n', 'YEAR', 'Prft Inv', 'Prft Hedge', 'Prft Cash', 'Prft Net', 'Prft Net%');
print();
for (year = 1996; year <= 2024; year++) {
  simulation(year);
}

