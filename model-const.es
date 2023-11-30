include 'model.es';

function modelConst() {
  MY:Reload();
  cnt = 0;
  max = 0;
  maxIdx = null;
  for (eq = 0.6; eq <= 0.6; eq = eq + 0.1) {
    d = 0.9 - eq;
    M:Initialize(eq, d);
    N = 128;
    model(1992, 2, 'Q', N, 'MC', 'MC', true);
    ES:Print('****************************');
    ES:Print('** ' + ES:Timestamp());
    ES:Print('** RUN=' + cnt);
    ES:Print('** PARAMS=' + eq + ', ' + d);
    ES:Print('** Equity Scale=' + M:EquityScale);
    ES:Print('** Hedge Scale=' + M:HedgeScale);
    ES:Print('** NET POSITION=' + ES:Get(MC:NET, N - 1));
    if (ES:Get(MC:NET, N - 1) > max) {
      ES:Print('** NEWMAX **');
      max = ES:Get(MC:NET, N - 1);
      maxIdx = cnt;
    }
    ES:Print('** MAX=' + max);
    ES:Print('** MAXIDX=' + maxIdx);
    ES:Print('****************************');
    cnt++;
  }
}

function M:Initialize(eq, d) {
  ES:GPut('M:CashPosition',     100000.0);
  ES:GPut('M:DurationPosition', 0.0);
  ES:GPut('M:EquityPosition',   0.0);
  ES:GPut('M:HedgePosition',    0.0);
  ES:GPut('M:EquityScale',      1.5); # some indications it might be closer to 1.75
  ES:GPut('M:HedgeScale',       1.0);

  ES:GPut('M:EQ', eq);
  ES:GPut('M:D', d);
  ES:GPut('M:C', 1.0 - eq - d);
}   

function M:Rebalance(date, period, flag) {
  netPosition = M:CashPosition + M:DurationPosition + M:EquityPosition + M:HedgePosition;
  ES:GPut('M:EquityPosition', M:EQ * netPosition);
  ES:GPut('M:DurationPosition', M:D * netPosition);
  ES:GPut('M:CashPosition', M:C * netPosition);
  ES:GPut('M:HedgePosition', 0.0 * netPosition);
}

