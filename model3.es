include 'model.es';

function M:Rebalance(date, period) {
  netPosition = M:CashPosition + M:DurationPosition + M:EquityPosition;
  s = ES:Chop(SP500GDP, date, date + period);
  s = :Get(s, 0);
  equityPct = M:Transform(s, 60, 180, 75, 0) / 100;
  :GPut('M:EquityPosition', equityPct * netPosition);

  c = M:GetCashYield(date, period);
  d = M:GetDurationYield(date, period);

  netPosition = netPosition - equityPct * netPosition;
  durationPct = d / (d + c);
  
  :GPut('M:DurationPosition', durationPct * netPosition);
  :GPut('M:CashPosition', (1 - durationPct) * netPosition);
}

