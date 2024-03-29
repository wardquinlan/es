include 'model.es';

# Optimal to date:
#****************************
#** Tue Nov 21 15:19:07 EST 2023
#** RUN=384
#** PARAMS=130, 150, 90, -50
#** NET POSITION=1259.6383
#** NEWMAX **
#** MAX=1259.6383
#** MAXIDX=384
#****************************
#
# Previous results:
# 100, 180, 90, -50 => 1186
# 140, 150, 90, -50 => 1251
# K = 3.5

function model3() {
  MY:Reload();
  cnt = 0;
  max = 0;
  maxIdx = null;
  # original loop:
  # 60..140, 150..200, 50..90, -50..0
  for (s1 = 135; s1 <= 135; s1 = s1 + 5) {
    for (s2 = 150; s2 <= 150; s2 = s2 + 5) {
      for (y1 = 90; y1 <= 90; y1 = y1 + 5) {
        for (y2 = -90; y2 <= -90; y2 = y2 + 5) {
          for (k = 3.5; k <= 3.5; k = k + 0.25) {
            M:Initialize(s1, s2, y1, y2, k);
            N = 128;
            model(1992, 1, 'Q', N, 'M3', 'M3', true);
            ES:Print('****************************');
            ES:Print('** ' + ES:Timestamp());
            ES:Print('** RUN=' + cnt);
            ES:Print('** PARAMS=' + s1 + ', ' + s2 + ', ' + y1 + ', ' + y2 + ', ' + k);
            ES:Print('** NET POSITION=' + ES:Get(M3:NET, N - 1));
            if (ES:Get(M3:NET, N - 1) > max) {
              ES:Print('** NEWMAX **');
              max = ES:Get(M3:NET, N - 1);
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
  ES:Log(DEBUG, 'initializing model3 with ' + s1 + ', ' + s2 + ', ' + y1 + ', ' + y2);
  ES:GPut('M:CashPosition',     100000.0);
  ES:GPut('M:DurationPosition', 0.0);
  ES:GPut('M:EquityPosition',   0.0);
  ES:GPut('M:HedgePosition',    0.0);
  ES:GPut('M:EquityScale',      1.0);
  ES:GPut('M:HedgeScale',       1.0);

  ES:GPut('M:S1', s1);
  ES:GPut('M:S2', s2);
  ES:GPut('M:Y1', y1);
  ES:GPut('M:Y2', y2);
  ES:GPut('M:K', k);
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
  cashPct = (c + ES:GGet('M:K'))/ (d + c + ES:GGet('M:K'));
  ES:Log(DEBUG, 'computed duration pct=' + (1 - cashPct));
  ES:Log(DEBUG, 'computed duration position=' + (1 - cashPct) * netPosition);
  ES:Log(DEBUG, 'computed cash pct=' + cashPct);
  ES:Log(DEBUG, 'computed cash position=' + cashPct * netPosition);
  
  ES:GPut('M:DurationPosition', (1 - cashPct) * netPosition);
  ES:GPut('M:CashPosition', cashPct * netPosition);
}

