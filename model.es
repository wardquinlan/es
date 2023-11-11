function M:Run(year) {
  if (year == null) {
    :Printf('%12s %12s %12s\n', 'Year', 'Cash Yld', 'Duration Yld');
    for (year = M:GetYearStart(); year <= M:GetYearEnd(); year++) {
      M:Run(year);
    }
    return;
  }

  :Printf('%12d %12.1f %12.1f\n', year,
    M:GetCashAssetsYield(year),
    M:GetDurationAssetsYield(year));
}

