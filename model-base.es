# approximate duration (in years) of duration assets
DURATION_YEARS = 8;

function model() {
  startYear = :DlgInput('Enter the model start year:');
  if (startYear == null) {
    throw 'model aborted by user';
  }
  startYear = :ParseInt(startYear);
  if (startYear == null) {
    throw 'invalid year: ' + year;
  }
  startMonth = :DlgInput('Enter the model start month:');
  if (startMonth == null) {
    throw 'model aborted by user';
  }
  startMonth = :ParseInt(startMonth);
  if (startMonth == null or startMonth < 1 or startMonth > 12) {
    throw 'invalid month: ' + startMonth;
  }
  type = :DlgInput('Enter the model type (Y / Q / M):');
  if (type == null) {
    throw 'model aborted by user';
  }
  if (type != 'Y' and type != 'Q' and type != 'M') {
    throw 'invalid type: ' + type;
  }
  periods = :DlgInput('Enter the # of periods:');
  if (periods == null) {
    throw 'model aborted by user';
  }
  periods = :ParseInt(periods);
  if (periods == null) {
    throw 'invalid # of periods: ' + periods;
  }
  name = :DlgInput('Enter the model name:');
  if (name == null) {
    throw 'model aborted by user';
  }
  results = :DlgInput('If you wish to save your results, enter a Global Name:');
  if (results == '') {
    results = null;
  }
  M:Run(name, results, type, startYear, startMonth, periods, true);
}

function M:Initialize() {
  MY:Reload();
  :GPut('M:CashPosition',     100000.0);
  :GPut('M:DurationPosition', 0.0);
  :GPut('M:EquityPosition',   0.0);
}

function M:GetDateBegin(date, period) {
  s = ES:Chop(DTB3, date, date + period);
  :Log(DEBUG, 'date (B)=' + :GetDate(s, 0));
  return :GetDate(s, 0);
}

function M:GetDateEnd(date, period) {
  s = ES:Chop(DTB3, date, date + period);
  :Log(DEBUG, 'date (B)=' + :GetDate(s, :GetSize(s) - 1));
  return :GetDate(s, :GetSize(s) - 1);
}

function M:GetCashYieldBegin(date, period) {
  s = ES:Chop(DTB3, date, date + period);
  :Log(DEBUG, ES:ToString(date) + ': annual cash yield (B)=' + :Get(s, 0));
  :Log(DEBUG, ES:ToString(date) + ': period cash yield (B)=' + ES:PeriodYield(:Get(s, 0), period));
  return ES:PeriodYield(:Get(s, 0), period);
}

function M:GetCashYieldEnd(date, period) {
  s = ES:Chop(DTB3, date, date + period);
  :Log(DEBUG, ES:ToString(date) + ': annual cash yield (E)=' + :Get(s, :GetSize(s) - 1));
  :Log(DEBUG, ES:ToString(date) + ': period cash yield (E)=' + ES:PeriodYield(:Get(s, :GetSize(s) - 1), period));
  return ES:PeriodYield(:Get(s, :GetSize(s) - 1), period);
}

function M:GetDurationYieldBegin(date, period) {
  s = ES:Chop(DGS10, date, date + period);
  :Log(DEBUG, ES:ToString(date) + ': annual duration yield (B)=' + :Get(s, 0));
  :Log(DEBUG, ES:ToString(date) + ': period duration yield (B)=' + ES:PeriodYield(:Get(s, 0), period));
  return ES:PeriodYield(:Get(s, 0), period);
}

function M:GetDurationYieldEnd(date, period) {
  s = ES:Chop(DGS10, date, date + period);
  :Log(DEBUG, ES:ToString(date) + ': annual duration yield (E)=' + :Get(s, :GetSize(s) - 1));
  :Log(DEBUG, ES:ToString(date) + ': period duration yield (E)=' + ES:PeriodYield(:Get(s, :GetSize(s) - 1), period));
  return ES:PeriodYield(:Get(s, :GetSize(s) - 1), period);
}

function M:GetDurationGain(date, period) {
  s = ES:Chop(DGS10, date, date + period);
  :Log(DEBUG, ES:ToString(date) + ': annual duration yield (E)=' + :Get(s, :GetSize(s) - 1));
  change = :Get(s, :GetSize(s) - 1) - :Get(s, 0);
  :Log(DEBUG, ES:ToString(date) + ': change in duration yield=' + change);
  :Log(DEBUG, ES:ToString(date) + ': duration gain=' + -change * DURATION_YEARS);
  return -change * DURATION_YEARS;
}

function M:GetEquityGain(date, period) {
  s = ES:Chop(SP500, date, date + period);
  :Log(DEBUG, ES:ToString(date) + ': equity value (B)=' + :Get(s, 0));
  :Log(DEBUG, ES:ToString(date) + ': equity value (E)=' + :Get(s, :GetSize(s) - 1));
  change = :Get(s, :GetSize(s) - 1) - :Get(s, 0);
  :Log(DEBUG, ES:ToString(date) + ': change in equity value=' + change);
  :Log(DEBUG, ES:ToString(date) + ': equity gain=' + change * 100 / :Get(s, 0));
  return change * 100 / :Get(s, 0);
}

function M:Rebalance(date, period) {
  netPosition = M:CashPosition + M:DurationPosition + M:EquityPosition;
  :Log(DEBUG, ES:ToString(date) + ': net position=' + netPosition);
  :Log(DEBUG, ES:ToString(date) + ': duration position=' + 0.3 * netPosition);
  :Log(DEBUG, ES:ToString(date) + ': equity position=' + 0.6 * netPosition);
  :Log(DEBUG, ES:ToString(date) + ': cash position=' + 0.1 * netPosition);
  :GPut('M:DurationPosition', 0.3 * netPosition);
  :GPut('M:EquityPosition', 0.6 * netPosition);
  :GPut('M:CashPosition', 0.1 * netPosition);
}

