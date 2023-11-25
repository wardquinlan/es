include 'model.es';

function model4() {
  MY:Reload();
  cnt = 0;
  max = 0;
  maxIdx = null;
  # original loop:
  # 60..140, 150..200, 50..90, -50..0
  for (s1 = 135; s1 <= 135; s1 = s1 + 5) {
    for (s2 = 150; s2 <= 150; s2 = s2 + 5) {
      for (y1 = 90; y1 <= 90; y1 = y1 + 5) {
        for (y2 = -70; y2 <= -70; y2 = y2 + 5) {
          for (k = 3.5; k <= 3.5; k = k + 0.25) {
            M:Initialize(s1, s2, y1, y2, k);
            #N = 128;
            #model(1992, 1, 'Q', N, 'M4', 'M4', true);
            N = 1;
            model(2022, 1, 'Q', N, 'M4', 'M4', true);
            ES:Print('****************************');
            ES:Print('** ' + ES:Timestamp());
            ES:Print('** RUN=' + cnt);
            ES:Print('** PARAMS=' + s1 + ', ' + s2 + ', ' + y1 + ', ' + y2 + ', ' + k);
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
  ES:Log(DEBUG, 'computed equity pct=' + equityPct);
  ES:Log(DEBUG, 'computed equity position=' + equityPct * netPosition);

  if (equityPct > 0) {
    ES:GPut('M:EquityPosition', equityPct * netPosition);
    ES:GPut('M:HedgePosition', 0.0);
    netPosition = netPosition - equityPct * netPosition;
  } else {
    ES:GPut('M:HedgePosition', -equityPct * netPosition);
    ES:GPut('M:EquityPosition', 0.0);
    netPosition = netPosition + equityPct * netPosition;
  }

  c = M:GetCashYield(date, period, flag);
  d = M:GetDurationYield(date, period, flag);

  ES:Log(DEBUG, 'revised net position=' + netPosition);
  cashPct = (c + M:K) / (d + c + M:K);
  ES:Log(DEBUG, 'computed duration pct=' + (1 - cashPct));
  ES:Log(DEBUG, 'computed duration position=' + (1 - cashPct) * netPosition);
  ES:Log(DEBUG, 'computed cash pct=' + cashPct);
  ES:Log(DEBUG, 'computed cash position=' + cashPct * netPosition);
  
  ES:GPut('M:DurationPosition', (1 - cashPct) * netPosition);
  ES:GPut('M:CashPosition', cashPct * netPosition);
}

