function M:Run(year) {
  if (year == null) {
    M:Initialize();
    :Printf('%4s %8s %8s %8s %8s %10s %10s %10s %10s\n', 'Year', 'Cash Yld', 'Drtn Yld', 'Drtn Gn', 'Eqty Gn', 
            'Cash Pos', 'Drtn Pos', 'Eqty Pos', 'Net Pos');
    for (year = M:GetYearStart(); year <= M:GetYearEnd(); year++) {
      M:Run(year);
    }
    return;
  }

  M:ReBalance();

  cashYield     = M:GetCashYield(year);
  durationYield = M:GetDurationYield(year);
  durationGain  = M:GetDurationGain(year);
  equityGain    = M:GetEquityGain(year);
  
  cashPosition     = M:CashPosition * (100 + cashYield) / 100;
  durationPosition = M:DurationPosition * (100 + durationYield + durationGain) / 100;
  equityPosition   = M:EquityPosition * (100 + equityGain) / 100;
  netPosition      = cashPosition + durationPosition + equityPosition;

  :Printf('%4d %8.1f %8.1f %8.1f %8.1f %10.2f %10.2f %10.2f %10.2f\n', 
    year,
    cashYield,
    durationYield,
    durationGain,
    equityGain,
    cashPosition,
    durationPosition,
    equityPosition,
    netPosition);

  :GPut('M:CashPosition', cashPosition);
  :GPut('M:DurationPosition', durationPosition);
  :GPut('M:EquityPosition', equityPosition);
}

