include 'model.es';

function modelShiller() {
  MY:Reload();
  cnt = 0;
  max = 0;
  maxIdx = null;
  for (e = 0; e <= 0; e++) {
    for (d = 0; d <= 0; d++) {
      M:Initialize(e, d);
      N = 128;
      model(1992, 1, 'Q', N, 'MS', 'MS', true);
      ES:Print('****************************');
      ES:Print('** ' + ES:Timestamp());
      ES:Print('** RUN=' + cnt);
      ES:Print('** PARAMS=' + e + ', ' + d);
      ES:Print('** Equity Scale=' + M:EquityScale);
      ES:Print('** Hedge Scale=' + M:HedgeScale);
      ES:Print('** NET POSITION=' + ES:Get(MS:NET, N - 1));
      if (ES:Get(MS:NET, N - 1) > max) {
        ES:Print('** NEWMAX **');
        max = ES:Get(MS:NET, N - 1);
        maxIdx = cnt;
      }
      ES:Print('** MAX=' + max);
      ES:Print('** MAXIDX=' + maxIdx);
      ES:Print('****************************');
      cnt++;
    }
  }
}

function M:Initialize(equityPremium, durationPremium) {
  ES:GPut('M:CashPosition',     100000.0);
  ES:GPut('M:DurationPosition', 0.0);
  ES:GPut('M:EquityPosition',   0.0);
  ES:GPut('M:HedgePosition',    0.0);
  ES:GPut('M:EquityScale',      1.0); # some indications it might be closer to 1.75
  ES:GPut('M:HedgeScale',       1.0);

  ES:GPut('M:EQUITYPREMIUM', equityPremium);
  ES:GPut('M:DURATIONPREMIUM', durationPremium);
}   

function M:Rebalance(date, period, flag) {
  ES:Log(DEBUG, 'period=' + flag);
  netPosition = M:CashPosition + M:DurationPosition + M:EquityPosition + M:HedgePosition;
  ES:Log(DEBUG, 'net position=' + netPosition);

  S = ES:Load(101);
  S = ES:Chop(S, date, date + period);
  S = 100 / S;
  idx = M:GetIndex(S, flag);
  S = ES:Get(S, idx);
  C = M:GetCashYield(date, period, flag);
  D = M:GetDurationYield(date, period, flag);

  ES:Log(DEBUG, 'cash yield=' + C);
  ES:Log(DEBUG, 'duration yield=' + D);
  ES:Log(DEBUG, 'equity yield=' + S);
}

