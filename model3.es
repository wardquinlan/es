include 'model.es';

function M:Rebalance(date, period) {
  netPosition = M:CashPosition + M:DurationPosition + M:EquityPosition;
  :Log(DEBUG, 'net position=' + netPosition);
  s = ES:Chop(SP500GDP, date, date + period);
  s = :Get(s, 0);
  :Log(DEBUG, ES:ToString(date) + ': SP500GDP=' + s);
  equityPct = M:Transform(s, 60, 180, 75, 0) / 100;
  :Log(DEBUG, 'computed equity pct=' + equityPct);
  :GPut('M:EquityPosition', equityPct * netPosition);

  c = M:GetCashYieldBegin(date, period);
  d = M:GetDurationYieldBegin(date, period);

  netPosition = netPosition - equityPct * netPosition;
  :Log(DEBUG, 'revised net position=' + netPosition);
  durationPct = d / (d + c);
  :Log(DEBUG, 'computed duration pct=' + durationPct);
  :Log(DEBUG, 'computed cash pct=' + (1 - durationPct));
  
  :GPut('M:DurationPosition', durationPct * netPosition);
  :GPut('M:CashPosition', (1 - durationPct) * netPosition);
}

