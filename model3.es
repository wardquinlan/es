include 'model.es';

function model3() {
  MY:Reload();
  M:Initialize(70, 200, 90, -30);
  model(1995, 1, 'Q', 1, 'M1995', 'M1995', true);
}

function M:Initialize(s1, s2, y1, y2) {
  ES:Log(DEBUG, 'initializing model3 with ' + s1 + ', ' + s2 + ', ' + y1 + ', ' + y2);
  ES:GPut('M:CashPosition',     100000.0);
  ES:GPut('M:DurationPosition', 0.0);
  ES:GPut('M:EquityPosition',   0.0);

  ES:GPut('M:S1', s1);
  ES:GPut('M:S2', s2);
  ES:GPut('M:Y1', y1);
  ES:GPut('M:Y2', y2);
}   

function M:Rebalance(date, period, flag) {
  ES:Log(DEBUG, 'rebalance: M:CashPosition=' + ES:GGet('M:CashPosition'));
  netPosition = M:CashPosition + M:DurationPosition + M:EquityPosition;
  ES:Log(DEBUG, 'net position=' + netPosition);
  s = ES:Chop(SP500GDP, date, date + period);
  idx = M:GetIndex(s, flag);
  d = ES:GetDate(s, idx);
  s = ES:Get(s, idx);
  ES:Log(DEBUG, ES:ToString(d) + ': SP500GDP=' + s);
  #equityPct = ES:Transform(s, 60, 180, 75, 0) / 100;
  #equityPct = ES:Transform(s, 70, 200, 90, -30) / 100;
  equityPct = ES:Transform(s, ES:GGet('M:S1'), ES:GGet('M:S2'), ES:GGet('M:Y1'), ES:GGet('M:Y2')) / 100;
  ES:Log(DEBUG, 'computed equity pct=' + equityPct);
  ES:Log(DEBUG, 'computed equity position=' + equityPct * netPosition);
  ES:GPut('M:EquityPosition', equityPct * netPosition);

  c = M:GetCashYield(date, period, flag);
  d = M:GetDurationYield(date, period, flag);

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

