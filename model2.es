include 'model.es';

# approximate duration (in years) of duration assets
DURATION_YEARS = 8;

function model2() {
  M:Run();
}

function M:Initialize() {
  :GPut('DTB3', ES:Load('DTB3'));
  :GPut('DGS10', ES:Load('DGS10'));
  :GPut('SP500', ES:Load('SP500'));
  :GPut('M:CashPosition',     100000.0);
  :GPut('M:DurationPosition', 0.0);
  :GPut('M:EquityPosition',   0.0);

  :Printf('Cash Position     : %10.2f\n', M:CashPosition);
  :Printf('Duration Position : %10.2f\n', M:DurationPosition);
  :Printf('Equity Position   : %10.2f\n', M:EquityPosition);
  :Printf('Net Position      : %10.2f\n', M:CashPosition + M:DurationPosition + M:EquityPosition);
  :Print();
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

function M:ReBalance() {
  :Log(DEBUG, 'M:ReBalance()');
}

