include 'model.es';

DURATION_YEARS = 8;

function initialize() {
  :GPut('DTB3', ES:Load('DTB3'));
  :GPut('DGS10', ES:Load('DGS10'));
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

function getCashAssetsYield(year) {
  s = ES:Chop(DTB3, ES:ToString(year) + '-01-01', ES:ToString(year) + '-12-31');
  return :Get(s, 0);
}
M:GetCashAssetsYield = getCashAssetsYield;

function getDurationAssetsYield(year) {
  s = ES:Chop(DGS10, ES:ToString(year) + '-01-01', ES:ToString(year) + '-12-31');
  return :Get(s, 0);
}
M:GetDurationAssetsYield = getDurationAssetsYield;

function getDurationAssetsGain(year) {
  s = ES:Chop(DGS10, ES:ToString(year) + '-01-01', ES:ToString(year) + '-12-31');
  change = :Get(s, :GetSize(s) - 1) - :Get(s, 0);
  return -change * DURATION_YEARS;
}
M:GetDurationAssetsGain = getDurationAssetsGain;

function model2() {
  M:Run();
}

