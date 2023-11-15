# approximate duration (in years) of duration assets
DURATION_YEARS = 8;

function model() {
  M:Run('BASE ALLOCATION MODEL', 'Y', 1995, 1, 10, true);
}

function M:Initialize() {
  MY:Reload();
  :GPut('M:CashPosition',     100000.0);
  :GPut('M:DurationPosition', 0.0);
  :GPut('M:EquityPosition',   0.0);
}

function M:GetCashYield(date, period) {
  s = ES:Chop(DTB3, date, date + period);
  :Log(DEBUG, ES:ToString(date) + ': annual cash yield=' + :Get(s, 0));
  :Log(DEBUG, ES:ToString(date) + ': period cash yield=' + ES:PeriodYield(:Get(s, 0), period));
  return ES:PeriodYield(:Get(s, 0), period);
}

function M:GetDurationYield(date, period) {
  s = ES:Chop(DGS10, date, date + period);
  :Log(DEBUG, ES:ToString(date) + ': annual duration yield (B)=' + :Get(s, 0));
  :Log(DEBUG, ES:ToString(date) + ': period duration yield=' + ES:PeriodYield(:Get(s, 0), period));
  return ES:PeriodYield(:Get(s, 0), period);
}

function M:GetDurationGain(date, period) {
  s = ES:Chop(DGS10, date, date + period);
  :Log(DEBUG, ES:ToString(date) + ': annual duration yield (E)=' + :Get(s, :GetSize(s) - 1));
  change = :Get(s, :GetSize(s) - 1) - :Get(s, 0);
  :Log(DEBUG, ES:ToString(date) + ': change in duration yield=' + change);
  :Log(DEBUG, ES:ToString(date) + ': duration gain=' + -change * DURATION_YEARS);
  return -change * DURATION_YEARS;
}

function M:GetEquityGain(date, period) {
  s = ES:Chop(SP500, date, date + period);
  :Log(DEBUG, ES:ToString(date) + ': equity value (B)=' + :Get(s, 0));
  :Log(DEBUG, ES:ToString(date) + ': equity value (E)=' + :Get(s, :GetSize(s) - 1));
  change = :Get(s, :GetSize(s) - 1) - :Get(s, 0);
  :Log(DEBUG, ES:ToString(date) + ': change in equity value=' + change);
  :Log(DEBUG, ES:ToString(date) + ': equity gain=' + change * 100 / :Get(s, 0));
  return change * 100 / :Get(s, 0);
}

function M:Rebalance(date, period) {
  netPosition = M:CashPosition + M:DurationPosition + M:EquityPosition;
  :Log(DEBUG, ES:ToString(date) + ': net position=' + netPosition);
  :Log(DEBUG, ES:ToString(date) + ': duration position=' + 0.3 * netPosition);
  :Log(DEBUG, ES:ToString(date) + ': equity position=' + 0.6 * netPosition);
  :Log(DEBUG, ES:ToString(date) + ': cash position=' + 0.1 * netPosition);
  :GPut('M:DurationPosition', 0.3 * netPosition);
  :GPut('M:EquityPosition', 0.6 * netPosition);
  :GPut('M:CashPosition', 0.1 * netPosition);
}

