# approximate duration (in years) of duration assets
DURATION_YEARS = 8;

function model() {
  M:Run('Y', 1995, 1, 10, true);
}

function M:Initialize() {
  MY:Reload();
  :GPut('M:CashPosition',     100000.0);
  :GPut('M:DurationPosition', 0.0);
  :GPut('M:EquityPosition',   0.0);
}

function M:GetCashYield(date, period) {
  s = ES:Chop(DTB3, date, date + period);
  return ES:PeriodYield(:Get(s, 0), period);
}

function M:GetDurationYield(date, period) {
  s = ES:Chop(DGS10, date, date + period);
  return ES:PeriodYield(:Get(s, 0), period);
}

function M:GetDurationGain(date, period) {
  s = ES:Chop(DGS10, date, date + period);
  change = :Get(s, :GetSize(s) - 1) - :Get(s, 0);
  return -change * DURATION_YEARS;
}

function M:GetEquityGain(date, period) {
  s = ES:Chop(SP500, date, date + period);
  change = :Get(s, :GetSize(s) - 1) - :Get(s, 0);
  return change * 100 / :Get(s, 0);
}

function M:Rebalance(date, period) {
  netPosition = M:CashPosition + M:DurationPosition + M:EquityPosition;
  :GPut('M:DurationPosition', 0.3 * netPosition);
  :GPut('M:EquityPosition', 0.6 * netPosition);
  :GPut('M:CashPosition', 0.1 * netPosition);
}

