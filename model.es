M:Initialize             = null;
M:GetYearStart           = null;
M:GetYearEnd             = null;
M:GetCashAssetsYield     = null;
M:GetDurationAssetsYield = null;
M:GetDurationAssetsGain  = null;

function M:Run(year) {
  if (year == null) {
    M:Initialize();
    :Printf('%4s %8s %8s %8s\n', 'Year', 'Cash Yld', 'Drtn Yld', 'Drtn Gn');
    for (year = M:GetYearStart(); year <= M:GetYearEnd(); year++) {
      M:Run(year);
    }
    return;
  }

  :Printf('%4d %8.1f %8.1f %8.1f\n', year,
    M:GetCashAssetsYield(year),
    M:GetDurationAssetsYield(year),
    M:GetDurationAssetsGain(year));
}

