# approximate duration (in years) of duration assets
DURATION_YEARS = 8;

function model(startYear, startMonth, type, periods, name, resultsBase, rebalance) {
  if (startYear == null) {
    startYear = ES:DlgInput('Enter the model start year:');
    if (startYear == null) {
      throw 'model aborted by user';
    }
    startYear = ES:ParseInt(startYear);
    if (startYear == null) {
      throw 'invalid year: ' + startYear;
    }
  }

  if (startMonth == null) {
    startMonth = ES:DlgInput('Enter the model start month:');
    if (startMonth == null) {
      throw 'model aborted by user';
    }
    startMonth = ES:ParseInt(startMonth);
    if (startMonth == null or startMonth < 1 or startMonth > 12) {
      throw 'invalid month: ' + startMonth;
    }
  }

  if (type == null) {
    type = ES:DlgInput('Enter the model type (Y / Q / M):');
    if (type == null) {
      throw 'model aborted by user';
    }
    if (type == 'y') {
      type = 'Y';
    }
    if (type == 'q') {
      type = 'Q';
    }
    if (type == 'm') {
      type = 'M';
    }
    if (type != 'Y' and type != 'Q' and type != 'M') {
      throw 'invalid type: ' + type;
    }
  }

  if (periods == null) {
    periods = ES:DlgInput('Enter the # of periods:');
    if (periods == null) {
      throw 'model aborted by user';
    }
    periods = ES:ParseInt(periods);
    if (periods == null) {
      throw 'invalid # of periods: ' + periods;
    }
  }

  if (name == null) {
    name = ES:DlgInput('Enter the model name:');
    if (name == null) {
      throw 'model aborted by user';
    }
    if (name == '') {
      ES:Log(WARN, 'unspecified model name');
    }
  }

  if (resultsBase == null) {
    resultsBase = ES:DlgInput('If you wish to save your results, enter a Global Name:');
    if (resultsBase == '') {
      resultsBase = null;
    }
  }

  if (rebalance == null) {
    rebalance = ES:DlgConfirm('Do you want to rebalance before the first period run?');
  }

  M:Run(name, resultsBase, type, startYear, startMonth, periods, rebalance);
}

function M:GetIndex(S, flag) {
  if (ES:GetSize(S) == 0) {
    throw 'ran out of data: ' + S;
  }
  if (flag == 'B') {
    idx = 0;
  } else {
    idx = ES:GetSize(S) - 1;
  }
  return idx;
}

function M:Initialize() {
  MY:Reload();
  ES:GPut('M:CashPosition',     100000.0);
  ES:GPut('M:DurationPosition', 0.0);
  ES:GPut('M:EquityPosition',   0.0);
  ES:GPut('M:HedgePosition',    0.0);
}

function M:GetDate(date, period, flag) {
  s = ES:Chop(DTB3, date, date + period);
  idx = M:GetIndex(s, flag);
  d = ES:GetDate(s, idx);
  ES:Log(DEBUG, ES:ToString(d));
  return d;
}

function M:GetCashYield(date, period, flag) {
  s = ES:Chop(DTB3, date, date + period);
  idx = M:GetIndex(s, flag);
  d = ES:GetDate(s, idx);
  ES:Log(DEBUG, ES:ToString(d) + ': cash yield=' + ES:Get(s, idx));
  return ES:Get(s, idx);
}

function M:GetDurationYield(date, period, flag) {
  s = ES:Chop(DGS10, date, date + period);
  idx = M:GetIndex(s, flag);
  d = ES:GetDate(s, idx);
  ES:Log(DEBUG, ES:ToString(d) + ': duration yield=' + ES:Get(s, idx));
  return ES:Get(s, idx);
}

function M:GetDurationGain(date, period) {
  s = ES:Chop(DGS10, date, date + period);
  d = ES:GetDate(s, ES:GetSize(s) - 1);
  ES:Log(DEBUG, ES:ToString(d) + ': annual duration yield (E)=' + ES:Get(s, ES:GetSize(s) - 1));
  change = ES:Get(s, ES:GetSize(s) - 1) - ES:Get(s, 0);
  ES:Log(DEBUG, ES:ToString(d) + ': change in duration yield=' + change);
  ES:Log(DEBUG, ES:ToString(d) + ': duration gain=' + -change * DURATION_YEARS);
  return -change * DURATION_YEARS;
}

function M:GetEquityGain(date, period) {
  s = ES:Chop(SP500, date, date + period);
  ES:Log(DEBUG, ES:ToString(ES:GetDate(s, 0)) + ': equity value (B)=' + ES:Get(s, 0));
  ES:Log(DEBUG, ES:ToString(ES:GetDate(s, ES:GetSize(s) - 1)) + ': equity value (E)=' + ES:Get(s, ES:GetSize(s) - 1));
  change = ES:Get(s, ES:GetSize(s) - 1) - ES:Get(s, 0);
  ES:Log(DEBUG, ES:ToString(ES:GetDate(s, ES:GetSize(s) - 1)) + ': change in equity value=' + change);
  ES:Log(DEBUG, ES:ToString(ES:GetDate(s, ES:GetSize(s) - 1)) + ': equity gain=' + change * 100 
    / ES:Get(s, 0));
  return change * 100 / ES:Get(s, 0);
}

function M:GetHedgeGain(date, period) {
  s = ES:Chop(SP500, date, date + period);
  ES:Log(DEBUG, ES:ToString(ES:GetDate(s, 0)) + ': hedge value (B)=' + ES:Get(s, 0));
  ES:Log(DEBUG, ES:ToString(ES:GetDate(s, ES:GetSize(s) - 1)) + ': hedge value (E)=' + ES:Get(s, ES:GetSize(s) - 1));
  change = ES:Get(s, 0) - ES:Get(s, ES:GetSize(s) - 1);
  ES:Log(DEBUG, ES:ToString(ES:GetDate(s, ES:GetSize(s) - 1)) + ': change in hedge value=' + change);
  ES:Log(DEBUG, ES:ToString(ES:GetDate(s, ES:GetSize(s) - 1)) + ': hedge gain=' + change * 100 
    / ES:Get(s, ES:GetSize(s) - 1));
  return change * 100 / ES:Get(s, ES:GetSize(s) - 1);
}

function M:Rebalance(date, period, flag) {
  netPosition = M:CashPosition + M:DurationPosition + M:EquityPosition + M:HedgePosition;
  if (flag == 'E') {
    date = date + period;
  }
  ES:Log(DEBUG, ES:ToString(date) + ': net position=' + netPosition);
  ES:Log(DEBUG, ES:ToString(date) + ': duration position=' + 0.3 * netPosition);
  ES:Log(DEBUG, ES:ToString(date) + ': equity position=' + 0.6 * netPosition);
  ES:Log(DEBUG, ES:ToString(date) + ': cash position=' + 0.1 * netPosition);
  ES:Log(DEBUG, ES:ToString(date) + ': hedge position=' + 0.0 * netPosition);
  ES:GPut('M:DurationPosition', 0.3 * netPosition);
  ES:GPut('M:EquityPosition', 0.6 * netPosition);
  ES:GPut('M:CashPosition', 0.1 * netPosition);
  ES:GPut('M:HedgePosition', 0.0 * netPosition);
}

