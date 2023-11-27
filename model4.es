include 'model.es';

function model4() {
  MY:Reload();
  cnt = 0;
  max = 0;
  maxIdx = null;
  # original loop:
  # 60..140, 150..200, 50..90, -50..0
  for (s1 = 135; s1 <= 135; s1 = s1 + 10) {
    for (s2 = 150; s2 <= 150; s2 = s2 + 10) {
      for (y1 = 90; y1 <= 90; y1 = y1 + 10) {
        for (y2 = -30; y2 <= -30; y2 = y2 + 5) {
          for (k = 3.5; k <= 3.5; k = k + 0.25) {
            M:Initialize(s1, s2, y1, y2, k);
            N = 128;
            model(1992, 1, 'Q', N, 'M4', 'M4', true);
            ES:Print('****************************');
            ES:Print('** ' + ES:Timestamp());
            ES:Print('** RUN=' + cnt);
            ES:Print('** PARAMS=' + s1 + ', ' + s2 + ', ' + y1 + ', ' + y2 + ', ' + k);
            ES:Print('** Equity Scale=' + M:EquityScale);
            ES:Print('** Hedge Scale=' + M:HedgeScale);
            ES:Print('** NET POSITION=' + ES:Get(M4:NET, N - 1));
            if (ES:Get(M4:NET, N - 1) > max) {
              ES:Print('** NEWMAX **');
              max = ES:Get(M4:NET, N - 1);
              maxIdx = cnt;
            }
            ES:Print('** MAX=' + max);
            ES:Print('** MAXIDX=' + maxIdx);
            ES:Print('****************************');
            cnt++;
          }
        }
      }
    }
  }
}

function M:Initialize(s1, s2, y1, y2, k) {
  ES:Log(DEBUG, 'initializing model4 with ' + s1 + ', ' + s2 + ', ' + y1 + ', ' + y2);
  ES:GPut('M:CashPosition',     100000.0);
  ES:GPut('M:DurationPosition', 0.0);
  ES:GPut('M:EquityPosition',   0.0);
  ES:GPut('M:HedgePosition',    0.0);
  ES:GPut('M:EquityScale',      1.5); # some indications it might be closer to 1.75
  ES:GPut('M:HedgeScale',       1.0);

  ES:GPut('M:S1', s1);
  ES:GPut('M:S2', s2);
  ES:GPut('M:Y1', y1);
  ES:GPut('M:Y2', y2);
  ES:GPut('M:K', k);
}   

function M:Rebalance(date, period, flag) {
  ES:Log(DEBUG, 'rebalance: M:CashPosition=' + ES:GGet('M:CashPosition'));
  netPosition = M:CashPosition + M:DurationPosition + M:EquityPosition + M:HedgePosition;
  ES:Log(DEBUG, 'net position=' + netPosition);
  s = ES:Chop(SP500GDP, date, date + period);
  idx = M:GetIndex(s, flag);
  d = ES:GetDate(s, idx);
  s = ES:Get(s, idx);
  ES:Log(DEBUG, ES:ToString(d) + ': SP500GDP=' + s);
  ES:Log(DEBUG, ES:ToString(d) + ': M:S1=' + M:S1);
  ES:Log(DEBUG, ES:ToString(d) + ': M:S2=' + M:S2);
  ES:Log(DEBUG, ES:ToString(d) + ': M:Y1=' + M:Y1);
  ES:Log(DEBUG, ES:ToString(d) + ': M:Y2=' + M:Y2);
  equityPct = ES:Transform(s, M:S1, M:S2, M:Y1, M:Y2) / 100;
  ES:Log(DEBUG, 'computed base equity pct=' + equityPct);

  if (equityPct > 0) {
    ES:GPut('M:EquityPosition', equityPct * netPosition / M:EquityScale);
    ES:Log(DEBUG, 'scaled equity position=' + M:EquityPosition);
    ES:GPut('M:HedgePosition', 0.0);
    netPosition = netPosition - M:EquityPosition;
  } else {
    ES:GPut('M:HedgePosition', -equityPct * netPosition / M:HedgeScale);
    ES:Log(DEBUG, 'scaled hedge position=' + M:HedgePosition);
    ES:GPut('M:EquityPosition', 0.0);
    netPosition = netPosition - M:HedgePosition;
  }

  c = M:GetCashYield(date, period, flag);
  d = M:GetDurationYield(date, period, flag);

  ES:Log(DEBUG, 'revised net position=' + netPosition);
  ES:Log(DEBUG, 'M:K=' + M:K);
  cashPct = (c + M:K) / (d + c + M:K);
  ES:Log(DEBUG, 'computed duration pct=' + (1 - cashPct));
  ES:Log(DEBUG, 'computed duration position=' + (1 - cashPct) * netPosition);
  ES:Log(DEBUG, 'computed cash pct=' + cashPct);
  ES:Log(DEBUG, 'computed cash position=' + cashPct * netPosition);
  
  ES:GPut('M:DurationPosition', (1 - cashPct) * netPosition);
  ES:GPut('M:CashPosition', cashPct * netPosition);
}

