include 'model.es';

M:GetYearStart           = null;
M:GetYearEnd             = null;
M:GetCashAssetsYield     = null;
M:GetDurationAssetsYield = null;

DTB3 = ES:Load('DTB3');
DGS10 = ES:Load('DGS10');

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


function model2() {
  M:Run();
}

