include 'model.es';

function model() {
  M:Run('QUARTERLY REALLOC MODEL', 'Q', 1995, 1, 116, true);
  :GPut('MODEL3', RESULTS);
}

function M:Rebalance(date, period) {
  netPosition = M:CashPosition + M:DurationPosition + M:EquityPosition;
  s = ES:Chop(SP500GDP, date, date + period);
  s = :Get(s, 0);
  equityPct = M:Transform(s, 80, 160, 65, 0) / 100;
  :GPut('M:EquityPosition', equityPct * netPosition);

  c = M:GetCashYield(date, period);
  d = M:GetDurationYield(date, period);

  netPosition = netPosition - equityPct * netPosition;
  durationPct = d / (d + c);
  
  :GPut('M:DurationPosition', durationPct * netPosition);
  :GPut('M:CashPosition', (1 - durationPct) * netPosition);
}

