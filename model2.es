include 'model.es';

# approximate duration (in years) of duration assets
DURATION_YEARS = 8;

# SP500 to GDP limits
MAX_SP500_GDP = 180;
MIN_SP500_GDP = 100;

# % Equity Allocation
MAX_EQUITY_ALLOCATION = 0.6;
MIN_EQUITY_ALLOCATION = 0.0;

function model2() {
  M:Run(true);
}

function M:Initialize() {
  if (!:Defined('DFF')) {
    MY:Reload();
  }
  :GPut('M:CashPosition',     100000.0);
  :GPut('M:DurationPosition', 0.0);
  :GPut('M:EquityPosition',   0.0);
}

function M:GetYearStart() {
  return 1995;
}

function M:GetYearEnd() {
  return 2023;
}

function M:GetCashYield(year) {
  s = ES:Chop(DTB3, ES:ToString(year) + '-01-01', ES:ToString(year) + '-12-31');
  return :Get(s, 0);
}

function M:GetDurationYield(year) {
  s = ES:Chop(DGS10, ES:ToString(year) + '-01-01', ES:ToString(year) + '-12-31');
  return :Get(s, 0);
}

function M:GetDurationGain(year) {
  s = ES:Chop(DGS10, ES:ToString(year) + '-01-01', ES:ToString(year) + '-12-31');
  change = :Get(s, :GetSize(s) - 1) - :Get(s, 0);
  return -change * DURATION_YEARS;
}

function M:GetEquityGain(year) {
  s = ES:Chop(SP500, ES:ToString(year) + '-01-01', ES:ToString(year) + '-12-31');
  change = :Get(s, :GetSize(s) - 1) - :Get(s, 0);
  return change * 100 / :Get(s, 0);
}

function M:Rebalance(year) {
  netPosition = M:CashPosition + M:DurationPosition + M:EquityPosition;

  # equity allocation.  Also see Utils.transform() - same transformation function
  y1 = 60;  # maximum equity allocation
  y2 = 0;   # minimum equity allocation
  s1 = 100; # minimum MKCAP to GDP
  s2 = 180; # maximum MKCAP to GDP

  function f(s) {
    s = :Min(s, 180);
    s = :Max(s, 100);
    S = (y2 - y1) / (s2 - s1);
    return S * (s - s1) + y1;
  }

  #print(M:Transform(150, 100, 200, 0, 10));

  S = ES:Chop(SP500GDP, ES:ToString(year) + '-01-01', ES:ToString(year) + '-12-31');
  s = :Get(S, 0);
  #equityPosition = f(s) / 100;
  equityPosition = M:Transform(s, 100, 180, 60, 0) / 100;

  :GPut('M:DurationPosition', 0.4 * netPosition);
  :GPut('M:EquityPosition', equityPosition * netPosition);
  :GPut('M:CashPosition', (0.6 - equityPosition) * netPosition);
}

