include 'model.es';

function M:Rebalance(date, period) {
  netPosition = M:CashPosition + M:DurationPosition + M:EquityPosition;
  ES:Log(DEBUG, 'net position=' + netPosition);
  s = ES:Chop(SP500GDP, date, date + period);
  d = :GetDate(s, 0);
  s = :Get(s, 0);
  ES:Log(DEBUG, ES:ToString(d) + ': SP500GDP=' + s);
  equityPct = M:Transform(s, 60, 180, 75, 0) / 100;
  ES:Log(DEBUG, 'computed equity pct=' + equityPct);
  ES:Log(DEBUG, 'computed equity position=' + equityPct * netPosition);
  ES:GPut('M:EquityPosition', equityPct * netPosition);

  c = M:GetCashYieldBegin(date, period);
  d = M:GetDurationYieldBegin(date, period);

  netPosition = netPosition - equityPct * netPosition;
  ES:Log(DEBUG, 'revised net position=' + netPosition);
  durationPct = d / (d + c);
  ES:Log(DEBUG, 'computed duration pct=' + durationPct);
  ES:Log(DEBUG, 'computed duration position=' + durationPct * netPosition);
  ES:Log(DEBUG, 'computed cash pct=' + (1 - durationPct));
  ES:Log(DEBUG, 'computed cash position=' + (1 - durationPct) * netPosition);
  
  ES:GPut('M:DurationPosition', durationPct * netPosition);
  ES:GPut('M:CashPosition', (1 - durationPct) * netPosition);
}

