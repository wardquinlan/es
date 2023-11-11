include 'model.es';

DURATION_YEARS = 8;

function initialize() {
  :GPut('DTB3', ES:Load('DTB3'));
  :GPut('DGS10', ES:Load('DGS10'));
  :GPut('SP500', ES:Load('SP500'));
  :GPut('M:CashPosition', 212000.0);
  :GPut('M:DurationPosition', 62000.0);
  :GPut('M:EquityPosition', 0.0);

  :Printf('Cash Position     : %10.2f\n', M:CashPosition);
  :Printf('Duration Position : %10.2f\n', M:DurationPosition);
  :Printf('Equity Position   : %10.2f\n', M:EquityPosition);
  :Printf('Net Position      : %10.2f\n', M:CashPosition + M:DurationPosition + M:EquityPosition);
  :Print();
}
M:Initialize = initialize;

function getYearStart() {
  return 1995;
}
M:GetYearStart = getYearStart;

function getYearEnd() {
  return 2023;
}
M:GetYearEnd = getYearEnd;

function getCashYield(year) {
  s = ES:Chop(DTB3, ES:ToString(year) + '-01-01', ES:ToString(year) + '-12-31');
  return :Get(s, 0);
}
M:GetCashYield = getCashYield;

function getDurationYield(year) {
  s = ES:Chop(DGS10, ES:ToString(year) + '-01-01', ES:ToString(year) + '-12-31');
  return :Get(s, 0);
}
M:GetDurationYield = getDurationYield;

function getDurationGain(year) {
  s = ES:Chop(DGS10, ES:ToString(year) + '-01-01', ES:ToString(year) + '-12-31');
  change = :Get(s, :GetSize(s) - 1) - :Get(s, 0);
  return -change * DURATION_YEARS;
}
M:GetDurationGain = getDurationGain;

function getEquityGain(year) {
  s = ES:Chop(SP500, ES:ToString(year) + '-01-01', ES:ToString(year) + '-12-31');
  change = :Get(s, :GetSize(s) - 1) - :Get(s, 0);
  return change * 100 / :Get(s, 0);
}
M:GetEquityGain = getEquityGain;

function model2() {
  M:Run();
}

