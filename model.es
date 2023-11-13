function M:Run(year) {
  if (year == null) {
    M:Initialize();
    :Printf('%4s %8s %8s %8s %8s %10s %5s %10s %5s %10s %5s %10s\n', 'Year', 'Cash Yld', 'Drtn Yld', 'Drtn Gn', 'Eqty Gn', 
            'Cash Pos', '', 'Drtn Pos', '', 'Eqty Pos', '', 'Net Pos');
    for (year = M:GetYearStart(); year <= M:GetYearEnd(); year++) {
      M:Run(year);
    }
    return;
  }

  M:ReBalance(year);

  cashYield     = M:GetCashYield(year);
  durationYield = M:GetDurationYield(year);
  durationGain  = M:GetDurationGain(year);
  equityGain    = M:GetEquityGain(year);
  
  cashPosition     = M:CashPosition * (100 + cashYield) / 100;
  durationPosition = M:DurationPosition * (100 + durationYield + durationGain) / 100;
  equityPosition   = M:EquityPosition * (100 + equityGain) / 100;
  netPosition      = cashPosition + durationPosition + equityPosition;

  cashPositionPct     = cashPosition / netPosition * 100;
  durationPositionPct = durationPosition / netPosition * 100;
  equityPositionPct   = equityPosition / netPosition * 100;

  :Printf('%4d %8.1f %8.1f %8.1f %8.1f %10.2f %5.1f %10.2f %5.1f %10.2f %5.1f %10.2f\n', 
    year,
    cashYield,
    durationYield,
    durationGain,
    equityGain,
    cashPosition,
    cashPositionPct,
    durationPosition,
    durationPositionPct,
    equityPosition,
    equityPositionPct,
    netPosition);

  :GPut('M:CashPosition', cashPosition);
  :GPut('M:DurationPosition', durationPosition);
  :GPut('M:EquityPosition', equityPosition);
}

