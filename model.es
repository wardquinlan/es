function M:Run(name, results, type, yearStart, monthStart, count, initialRebalance) {
  if (type == 'Y') {
    period = 365;
  } else if (type == 'Q') {
    period = 90;
  } else if (type == 'M') {
    period = 30;
  } else {
    throw 'invalid type: ' + type;
  }

  # initialize with balances
  M:Initialize();

  :Printf('Model Name         : %s\n', name);
  :Printf('Model Results      : %s\n', results);
  :Printf('Model Type         : %s\n', type);
  :Printf('Year Start         : %d\n', yearStart);
  :Printf('Month Start        : %d\n', monthStart);
  :Printf('Count              : %d\n', count);
  :Printf('Initial rebal flag : %b\n', initialRebalance);
  :Print();
  :Print('Initial positions');
  :Print('-----------------');
  :Printf('Cash Position      : %10.2f\n', M:CashPosition);
  :Printf('Duration Position  : %10.2f\n', M:DurationPosition);
  :Printf('Equity Position    : %10.2f\n', M:EquityPosition);
  :Printf('Net Position       : %10.2f\n', M:CashPosition + M:DurationPosition + M:EquityPosition);
  :Print();

  if (true == initialRebalance) {
    # very first rebalance at the start of the first period
    M:Rebalance(:Date(ES:ToString(yearStart) + '-' + monthStart + '-01'), period);
  }
  if (results != null) {
    r = :Create(results);
    :SetTitle(r, name);
    :Insert(r, :Date(ES:ToString(yearStart) + '-' + monthStart + '-01'), (M:CashPosition + M:DurationPosition + M:EquityPosition) / 1000);
    :GPut(results, r);
  }

  :Printf('%30s %8s %8s %8s %8s %10s %5s %10s %5s %10s %5s %10s\n', 'Period-Start', 'Cash-Yld', 'Drtn-Yld', 'Drtn-Gn', 'Eqty-Gn', 
          'Cash-Pos', '', 'Drtn-Pos', '', 'Eqty-Pos', '', 'Net-Pos');
  :Print();
    
  year = yearStart;
  month = monthStart;
  cnt = 0;
  while (cnt < count) {
    date = :Date(ES:ToString(year) + '-' + month + '-01');
    M:RunPeriod(date, period, results);
    if (type == 'Y') {
      year++;
    } else if (type == 'Q') {
      month = month + 3;
      if (month > 12) {
        year++;
        month = 1;
      }
    } else if (type == 'M') {
      month++;
      if (month > 12) {
        year++;
        month = 1;
      }
    } else {
      throw 'invalid type: ' + type;
    }
    cnt++;
  }
}

function M:RunPeriod(date, period, results) {
  function printLine(ind) {
    if (ind == 'B') {
      cashYield = cashYieldBegin;
      durationYield = durationYieldBegin;
      format = '%30s %8.2f %8.2f %8s %8s %10.2f %5.1f %10.2f %5.1f %10.2f %5.1f %10.2f\n';
      durationGain = '';
      equityGain = '';
    } else {
      cashYield = cashYieldEnd;
      durationYield = durationYieldEnd;
      format = '%30s %8.2f %8.2f %8.2f %8.2f %10.2f %5.1f %10.2f %5.1f %10.2f %5.1f %10.2f\n';
    }
    :Printf(format,
      ES:ToString(date) + ' ' + ind,
      cashYield,
      durationYield,
      durationGain,
      equityGain,
      cashPosition,
      cashPositionPct,
      durationPosition,
      durationPositionPct,
      equityPosition,
      equityPositionPct,
      netPosition);
  }

  # get the yields/gains for the current period
  cashYieldBegin     = M:GetCashYieldBegin(date, period);
  durationYieldBegin = M:GetDurationYieldBegin(date, period);
  cashYieldEnd       = M:GetCashYieldEnd(date, period);
  durationYieldEnd   = M:GetDurationYieldEnd(date, period);
  durationGain       = M:GetDurationGain(date, period);
  equityGain         = M:GetEquityGain(date, period);
  
  # calculate the positions at the beginning of the period
  cashPosition        = M:CashPosition;
  durationPosition    = M:DurationPosition;
  equityPosition      = M:EquityPosition;
  netPosition         = cashPosition + durationPosition + equityPosition;
  cashPositionPct     = cashPosition / netPosition * 100;
  durationPositionPct = durationPosition / netPosition * 100;
  equityPositionPct   = equityPosition / netPosition * 100;
  printLine('B');

  # calculate the positions at the end of the period
  cashPosition        = M:CashPosition * (100 + cashYieldBegin) / 100;
  durationPosition    = M:DurationPosition * (100 + durationYieldBegin + durationGain) / 100;
  equityPosition      = M:EquityPosition * (100 + equityGain) / 100;
  netPosition         = cashPosition + durationPosition + equityPosition;
  cashPositionPct     = cashPosition / netPosition * 100;
  durationPositionPct = durationPosition / netPosition * 100;
  equityPositionPct   = equityPosition / netPosition * 100;
  printLine('E');

  :GPut('M:CashPosition', cashPosition);
  :GPut('M:DurationPosition', durationPosition);
  :GPut('M:EquityPosition', equityPosition);

  # rebalance for the current period
  M:Rebalance(date, period);

  # calculate the positions after rebalancing
  cashPosition        = M:CashPosition;
  durationPosition    = M:DurationPosition;
  equityPosition      = M:EquityPosition;
  netPosition         = cashPosition + durationPosition + equityPosition;
  cashPositionPct     = cashPosition / netPosition * 100;
  durationPositionPct = durationPosition / netPosition * 100;
  equityPositionPct   = equityPosition / netPosition * 100;
  printLine('R');

  :GPut('M:CashPosition', cashPosition);
  :GPut('M:DurationPosition', durationPosition);
  :GPut('M:EquityPosition', equityPosition);

  if (results != null) {
    r = :GGet(results);
    :Insert(r, date + period, netPosition / 1000);
    :GPut(results, r);
  }
  :Print();
}

# Transforms s1..s2 space into y1..y2 space.  Note that s is force-bounded into s1..s2.
function M:Transform(s, s1, s2, y1, y2) {
  # bound s to within s1..s2
  s = :Min(s, s2);
  s = :Max(s, s1);

  # transformation constant
  S = (y2 - y1) / (s2 - s1);
  return S * (s - s1) + y1;
}

include 'model-base.es';

