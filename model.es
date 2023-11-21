function M:Run(name, resultsBase, type, yearStart, monthStart, count, initialRebalance) {
  if (type == 'Y') {
    period = 365;
  } else if (type == 'Q') {
    period = 90;
  } else if (type == 'M') {
    period = 30;
  } else {
    throw 'invalid type: ' + type;
  }

  ES:Printf('Model Name         : %s\n', name);
  ES:Printf('Model Results Base : %s\n', resultsBase);
  ES:Printf('Model Type         : %s\n', type);
  ES:Printf('Year Start         : %d\n', yearStart);
  ES:Printf('Month Start        : %d\n', monthStart);
  ES:Printf('Count              : %d\n', count);
  ES:Printf('Initial rebal flag : %b\n', initialRebalance);
  ES:Print();
  ES:Print('Initial positions');
  ES:Print('-----------------');
  ES:Printf('Cash Position      : %10.2f\n', M:CashPosition);
  ES:Printf('Duration Position  : %10.2f\n', M:DurationPosition);
  ES:Printf('Equity Position    : %10.2f\n', M:EquityPosition);
  ES:Printf('Net Position       : %10.2f\n', M:CashPosition + M:DurationPosition + M:EquityPosition);
  ES:Print();

  if (true == initialRebalance) {
    # very first rebalance at the start of the first period
    M:Rebalance(:Date(ES:ToString(yearStart) + '-' + monthStart + '-01'), period, 'B');
  }
  if (resultsBase != null) {
    function fn(obj) {
      r = ES:Create(resultsBase + ':' + obj);
      ES:SetTitle(r, name + ':' + obj);
      ES:GPut(resultsBase + ':' + obj, r);
    }
    ES:Iterate(fn, 'CASH', 'DURATION', 'EQUITY', 'NET');
  }

  ES:Printf('%30s %8s %8s %8s %8s %10s %5s %10s %5s %10s %5s %10s\n', 'Period-Start', 'Cash-Yld', 'Drtn-Yld', 'Drtn-Gn', 'Eqty-Gn', 
          'Cash-Pos', '', 'Drtn-Pos', '', 'Eqty-Pos', '', 'Net-Pos');
  ES:Print();
    
  year = yearStart;
  month = monthStart;
  cnt = 0;
  while (cnt < count) {
    ES:Print('[Iteration #' + cnt + ']');
    M:RunPeriod(type, year, month, period, resultsBase);
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

  if (resultsBase != null) {
    MY:Plot(ES:GGet(resultsBase + ':CASH'), ES:GGet(resultsBase + ':DURATION'), ES:GGet(resultsBase + ':EQUITY'), ES:GGet(resultsBase + ':NET'));
  }
}

function M:RunPeriod(type, year, month, period, resultsBase) {
  function printLine(ind) {
    if (ind == 'B') {
      date = dateBegin;
      cashYield = cashYieldBegin;
      durationYield = durationYieldBegin;
      format = '%30s %8.2f %8.2f %8s %8s %10.2f %5.1f %10.2f %5.1f %10.2f %5.1f %10.2f\n';
      durationGain = '';
      equityGain = '';
    } else if (ind == 'E') {
      date = dateEnd;
      cashYield = '';
      durationYield = durationYieldEnd;
      format = '%30s %8s %8.2f %8.2f %8.2f %10.2f %5.1f %10.2f %5.1f %10.2f %5.1f %10.2f\n';
    } else {
      date = dateEnd;
      cashYield = '';
      durationYield = '';
      durationGain = '';
      equityGain = '';
      format = '%30s %8s %8s %8s %8s %10.2f %5.1f %10.2f %5.1f %10.2f %5.1f %10.2f\n';
    }
    ES:Printf(format,
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

  date = :Date(ES:ToString(year) + '-' + month + '-01');

  # get the yields/gains for the current period
  dateBegin          = M:GetDate(date, period, 'B');
  cashYieldBegin     = M:GetCashYield(date, period, 'B');
  durationYieldBegin = M:GetDurationYield(date, period, 'B');
  dateEnd            = M:GetDate(date, period, 'E');
  durationYieldEnd   = M:GetDurationYield(date, period, 'E');
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
  cashPosition        = M:CashPosition * (100 + ES:PeriodYield(cashYieldBegin, period)) / 100;
  durationPosition    = M:DurationPosition * (100 + ES:PeriodYield(durationYieldBegin, period) +
                        durationGain) / 100;
  equityPosition      = M:EquityPosition * (100 + equityGain) / 100;
  netPosition         = cashPosition + durationPosition + equityPosition;
  cashPositionPct     = cashPosition / netPosition * 100;
  durationPositionPct = durationPosition / netPosition * 100;
  equityPositionPct   = equityPosition / netPosition * 100;
  printLine('E');

  if (resultsBase != null) {
# uncomment this if you want to report results against the beginning of the next period:
#   if (type == 'Y') {
#     year++;
#   } else if (type == 'Q') {
#     month = month + 3;
#     if (month > 12) {
#       year++;
#       month = 1;
#     }
#   } else if (type == 'M') {
#     month++;
#     if (month > 12) {
#       year++;
#       month = 1;
#     }
#   } else {
#     throw 'invalid type: ' + type;
#   }
    date = ES:Date(ES:ToString(year) + '-' + month + '-01');

    r = ES:GGet(resultsBase + ':CASH');
    ES:Insert(r, date, cashPosition / 1000);
    ES:GPut(resultsBase + ':CASH', r);

    r = ES:GGet(resultsBase + ':DURATION');
    ES:Insert(r, date, durationPosition / 1000);
    ES:GPut(resultsBase + ':DURATION', r);

    r = ES:GGet(resultsBase + ':EQUITY');
    ES:Insert(r, date, equityPosition / 1000);
    ES:GPut(resultsBase + ':EQUITY', r);

    r = ES:GGet(resultsBase + ':NET');
    ES:Insert(r, date, netPosition / 1000);
    ES:GPut(resultsBase + ':NET', r);
  }

  ES:GPut('M:CashPosition', cashPosition);
  ES:GPut('M:DurationPosition', durationPosition);
  ES:GPut('M:EquityPosition', equityPosition);

  # rebalance for the current period
  M:Rebalance(date, period, 'E');

  # calculate the positions after rebalancing
  cashPosition        = M:CashPosition;
  durationPosition    = M:DurationPosition;
  equityPosition      = M:EquityPosition;
  netPosition         = cashPosition + durationPosition + equityPosition;
  cashPositionPct     = cashPosition / netPosition * 100;
  durationPositionPct = durationPosition / netPosition * 100;
  equityPositionPct   = equityPosition / netPosition * 100;
  printLine('R');

  ES:GPut('M:CashPosition', cashPosition);
  ES:GPut('M:DurationPosition', durationPosition);
  ES:GPut('M:EquityPosition', equityPosition);

  ES:Print();
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

