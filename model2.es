include 'model.es';

function model() {
  M:Run('BASIC QUARTERLY REALLOC MODEL', 'Q', 1995, 1, 116, true);
}

function M:Rebalance(date, period) {
  netPosition = M:CashPosition + M:DurationPosition + M:EquityPosition;
  :GPut('M:DurationPosition', 0.3 * netPosition);
  :GPut('M:EquityPosition', 0.6 * netPosition);
  :GPut('M:CashPosition', 0.1 * netPosition);
}

