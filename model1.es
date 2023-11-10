function model1() {
  function run(year) {
    :Log(DEBUG, 'Year: ' + year);
    date1 = ES:ToString(year - 1) + '-' + DAY_START;
    date2 = ES:ToString(year) + '-' + DAY_END;

    S = ES:Chop(SP500, date1, date2);
    INVERSE = ES:Scale(S, -1);
    HEDGE = ES:Scale(S, HEDGE_SCALE);
    #ES:Assert(:GetSize(S) == :GetSize(INVERSE));
    #ES:Assert(:GetSize(S) == :GetSize(HEDGE));
    N = :GetSize(S);
    PROFIT_INVERSE = INVERSE_ASSETS * (:Get(INVERSE, N - 1) - :Get(INVERSE, 0)) / :Get(INVERSE, 0);
    PROFIT_HEDGE = HEDGED_ASSETS * (:Get(HEDGE, N - 1) - :Get(HEDGE, 0)) / :Get(HEDGE, 0);

    CASH_YIELD = :Get(ES:Chop(DTB3, date1, date2), 0) / 100;
    PROFIT_CASH = CASH_ASSETS * CASH_YIELD;

    DURATION = ES:Chop(DGS10, date1, date2);
    DURATION_YIELD = :Get(DURATION, 0) / 100;
    :Log(DEBUG, 'Duration yield: ' + DURATION_YIELD);
    INTEREST_RATE_CHG = :Get(DURATION, :GetSize(DURATION) - 1) / 100 - DURATION_YIELD;
    :Log(DEBUG, 'Interest rate change: ' + INTEREST_RATE_CHG * 100);
    DURATION_CAPITAL_GAIN = -INTEREST_RATE_CHG * DURATION_YEARS * DURATION_ASSETS;
    :Log(DEBUG, 'Duration capital gain: ' + DURATION_CAPITAL_GAIN);
    PROFIT_DURATION = DURATION_ASSETS * DURATION_YIELD + DURATION_CAPITAL_GAIN;
    :Log(DEBUG, 'Duration total return: ' + PROFIT_DURATION);

    PROFIT_NET = PROFIT_INVERSE + PROFIT_HEDGE + PROFIT_CASH + PROFIT_DURATION;
    PROFIT_NET_PCT = 100 * PROFIT_NET / TOTAL_ASSETS;
  
    printf('%12d  $%12.2f  $%12.2f  %12.0f%%  $%12.2f  %12.0f%%  $%12.2f  $%12.2f  %12.0f%%\n', 
             year, 
             PROFIT_INVERSE, 
             PROFIT_HEDGE, 
             CASH_YIELD * 100,
             PROFIT_CASH, 
             DURATION_YIELD * 100,
             PROFIT_DURATION,
             PROFIT_NET,
             PROFIT_NET_PCT);
  }

  # model parameters
  DURATION_ASSETS = 62000.0;
  INVERSE_ASSETS = 126000.0;
  HEDGED_ASSETS = :ParseFloat(:DlgInput('Enter the amount of Hedged Assets:'));
  CASH_ASSETS = 221000.0 - HEDGED_ASSETS;
  TOTAL_ASSETS = CASH_ASSETS + DURATION_ASSETS + INVERSE_ASSETS + HEDGED_ASSETS;
  HEDGE_SCALE = :ParseFloat(:DlgInput('Enter the Hedge Scale:'));
  DURATION_YEARS = 8.0; # 8 years of duration on duration assets
  DAY_START = '04-01';
  DAY_END = '03-31';

  # load required series
  SP500 = ES:Load(500);
  DTB3 = ES:Load(3);
  DGS10 = ES:Load(120);

  print('Asset Model');
  print('-----------');
  printf('Period Start    : %s\n', DAY_START);
  printf('Period End      : %s\n', DAY_END);
  printf('Cash Assets     : $%12.2f\n', CASH_ASSETS);
  printf('Duration Assets : $%12.2f\n', DURATION_ASSETS);
  printf('Inverse Assets  : $%12.2f\n', INVERSE_ASSETS);
  printf('Hedged Assets   : $%12.2f\n', HEDGED_ASSETS);
  printf('Total Assets    : $%12.2f\n', TOTAL_ASSETS);
  printf('Hedge Scale     :  %12.2f\n', HEDGE_SCALE);
  printf('Duration        :  %12.2f years\n', DURATION_YEARS);
  print();

  printf('%12s   %12s   %12s   %12s   %12s   %12s   %12s   %12s   %12s\n', 
         'YEAR', 
         'Prft Inv', 
         'Prft Hedge', 
         'Cash Yield',
         'Prft Cash', 
         'Dur Yield',
         'Prft Dur', 
         'Prft Net', 
         'Prft Net%');
  print();

  for (year = 1996; year <= 2024; year++) {
    run(year);
  }
}

