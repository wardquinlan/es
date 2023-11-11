function MY:Update(object) {
  if (ES:Update(object)) {
    MY:Reload();
  }
}

function MY:Generate(year, bound) {
  function ldigits(d) {
    if (d < 10) {
      return '0' + d;
    }
    return ES:ToString(d);
  }

  function maxDay(m) {
    if (m == 2)
      return 28;
    if (m == 4 or m == 6 or m == 9 or m == 11)
      return 30;
    return 31;
  }

  if (year == null) {
    year = 2023;
  }
  if (bound == null) {
    bound = 1000;
  }
  my = :Create('my');
  :SetTitle(my, 'Generated series, year=' + year + ', bound=' + bound);
  for (month = 1; month <= 12; month++) {
    mday = maxDay(month);
    for (day = 1; day <= mday; day++) {
      date = ES:ToString(year) + '-';
      date = date + ldigits(month) + '-';
      date = date + ldigits(day);
      :Insert(my, date, :Random(bound));
    }
  }
  return my;
}

function MY:Reload() {
  :Log(INFO, 'loading series from datastore...');
  :Ds(ES:AutoLoad);
  MY:CreateRC();
  MY:CreatePC1(GDP, 4);
  MY:CreateInv(T10Y3M);
  MY:CreateInv(T10Y2Y);
  MY:CreateSP500(DGS10);
  MY:CreateJU();
  MY:CreatePC1WithLimit(RSAFS, 12, 12);
  MY:CreatePC1(PCEPILFE, 12);
  MY:CreatePC1WithLimit(PCEDG, 12, 12);
  MY:CreatePC1WithLimit(PCES, 12, 12);
  MY:CreatePC1WithLimit(DGORDER, 12, 12);
  MY:CreateVIX();
  MY:CreatePC1WithLimit(PPIACO, 12, 12);
  MY:CreateDGS1FC();
  MY:CreateWALCL();
  MY:CreateICSA();
}

function MY:UpdateMain() {
  :Iterate(ES:Update, 500, 120, 24, 3, 61);
}

function MY:Plot(arg1, arg2, arg3, arg4) {
  function dxincr(series) {
    if (series == null) {
      return 18;
    }
    if (:GetFrequencyShort(series) == 'D') {
      return 1;
    } else if (:GetFrequencyShort(series) == 'W') {
      return 8;
    } else {
      return 18;
    }
  }

  if (arg1 == null) {
    :Log(INFO, 'no series passed, nothing to do');
    return;
  }

  if (:GetType(arg1) == 'String' and ES:EndsWith(arg1, '.xml')) {
    :Log(DEBUG, 'arg1 detected as xml file, loading xml: ' + arg1);
    if (arg2 != null) {
      :Log(WARN, 'xml file detected, ignoring additional argument(s)');
    }
    if (!:Defined('DFF')) {
      MY:Reload();
      ES:Assert(:Defined('DFF'), 'DFF not loaded');
    }
    :Plot(arg1);
    return;
  }

  :Log(DEBUG, 'loading series...');
  arg1 = ES:Load(arg1);
  arg2 = ES:Load(arg2);
  arg3 = ES:Load(arg3);
  arg4 = ES:Load(arg4);

  :Log(DEBUG, 'computing lowest values...');
  l1 = l2 = l3 = l4 = 0.01;
  if (arg1 != null and :GetSeriesType(arg1) == 'float') {
    l1 = ES:Lowest(arg1);
  }
  if (arg2 != null and :GetSeriesType(arg2) == 'float') {
    l2 = ES:Lowest(arg2);
  }
  if (arg3 != null and :GetSeriesType(arg3) == 'float') {
    l3 = ES:Lowest(arg3);
  }
  if (arg4 != null and :GetSeriesType(arg4) == 'float') {
    l4 = ES:Lowest(arg4);
  }

  :Log(DEBUG, 'computing scaling type...');
  if (l1 > 0 and l2 > 0 and l3 > 0 and l4 > 0) {
    :Log(DEBUG, 'LOG scaling detected');
    defaults.chart.scaletype = LOG;
  } else {
    :Log(DEBUG, 'LINEAR scaling detected');
    defaults.chart.scaletype = LINEAR;
  }

  :Log(DEBUG, 'computing dxincr...');
  defaults.panel.frequency = MONTHS;
  dx = dxincr(arg1);
  dx = :Min(dx, dxincr(arg2));
  dx = :Min(dx, dxincr(arg3));
  dx = :Min(dx, dxincr(arg4));
  :Log(DEBUG, 'detected dxincr = ' + dx);
  defaults.panel.dxincr = dx;

  defaults.panel.label = 'Consolidated Panel';

  if (:GetTitle(arg1) != null) {
    defaults.chart.label = :GetTitle(arg1);
  }
  if (arg2 != null and :GetTitle(arg2) != null) {
    defaults.chart.label = defaults.chart.label + ' / ' + :GetTitle(arg2);
  }  
  if (arg3 != null and :GetTitle(arg3) != null) {
    defaults.chart.label = defaults.chart.label + ' / ' + :GetTitle(arg3);
  }  
  if (arg4 != null and :GetTitle(arg4) != null) {
    defaults.chart.label = defaults.chart.label + ' / ' + :GetTitle(arg4);
  }  
  :Plot(arg1, arg2, arg3, arg4);
}

function MY:Input() {
  n = :DlgInput('Enter the series number:');
  if (n == null) {
    return;
  }
  id = :ParseInt(n);
  if (id == null) {
    :DlgMessage('Series number must be an int', ERROR);
    return;
  }
  
  d = :DlgInput('Enter the date:');
  if (d == null) {
    return;
  }

  v = :DlgInput('Enter the value:');
  if (v == null) {
    return;
  }
  v = :ParseFloat(v);
  if (v == null) {
    :DlgMessage('Value must be a float', ERROR);
    return;
  }
  
  S = :Load(id);
  message = 'updating ' + :GetName(S) + ':' + id + ' on ' + d + ' with ' + v;
  if (!:DlgConfirm(message)) {
    return;
  }

  try {
    :Insert(S, d, v);
    :Merge(S, '--with-inserts');
    :DlgMessage(:GetName(S) + ' has been merged');
  } catch (ex) {
    :DlgMessage('An error has occurred: ' + ex, ERROR);
  }
}

function MY:SP500() {
  while (true) {
    value = :DlgInput('Enter today\'s value of SP500:');
    if (value == null) {
      return;
    }
    value = :ParseFloat(value);
    if (value == null) {
      :DlgMessage('Value must be a float', ERROR);
      continue;
    }
    break;
  }

  S = :Load(500);
  if (:GetDate(S, :GetSize(S) - 1) < :Today()) {
    message = 'updating SP500 on ' + :Today() + ' with ' + value + '; proceed?';
    if (!:DlgConfirm(message)) {
      return;
    }
    :Insert(S, :Today(), value);
    :Merge(S, '--with-inserts');
    :DlgMessage('SP500 has been merged');
    return;
  }
  :DlgMessage('SP500 already has a value for that date');
}

function MY:View() {
  if (!:Defined('DFF')) {
    MY:Reload();
    ES:Assert(:Defined('DFF'), 'DFF not loaded');
  }
  :Plot('es.xml');
}

function MY:Logf(series, r) {
  F = (E - E^LOGF.K) * r / LOGF.NR + E^LOGF.K;
  return :Ln(F) * series;
}

function MY:Summary() {
  function summarize(id) {
    series = :Load(id);
    :Print('[' + :GetId(series) + '] [' + MY:LastDate(series) + '] ' + MY:Last(series) + ' => ' + MY:Last(:Change(series)));
    :Print(:GetTitle(series));
    :Print();
  }
  :Print();
  :Iterate(summarize, 500, 120, 24, 3, 61);
}

function MY:Last(series) {
  series = ES:Load(series);
  if (:GetSize(series) == 0) {
    return null;
  }
  return :Get(series, :GetSize(series) - 1);
}

function MY:LastDate(series) {
  series = ES:Load(series);
  if (:GetSize(series) == 0) {
    return null;
  }
  return :GetDate(series, :GetSize(series) - 1);
}

function MY:CreateRC() {
  DT = :Date(GDP);
  R1953 = DT >= '1953-07-01' and DT <= '1954-05-31';
  R1957 = DT >= '1957-08-01' and DT <= '1958-04-30';
  R1960 = DT >= '1960-04-01' and DT <= '1961-02-28';
  R1969 = DT >= '1969-12-01' and DT <= '1970-11-30';
  R1973 = DT >= '1973-11-01' and DT <= '1975-03-31';
  R1980 = DT >= '1980-01-01' and DT <= '1980-07-31';
  R1981 = DT >= '1981-07-01' and DT <= '1982-11-30';
  R1990 = DT >= '1990-07-01' and DT <= '1991-03-31';
  R2001 = DT >= '2001-03-01' and DT <= '2001-11-30';
  R2007 = DT >= '2007-12-01' and DT <= '2009-06-30';
  R2020 = DT >= '2020-02-01' and DT <= '2020-04-30';
  RC = (R1969 or R1973 or R1980 or R1981 or R1990 or R2001 or R2007 or R2020);
  :SetName(RC, 'RC');
  :SetTitle(RC, 'NBER-defined Recessions');
  :SetNotes(RC, 'Source: https://www.nber.org/research/data/us-business-cycle-expansions-and-contractions');
  :SetSource(RC, 'NBER');
  :GPut('RC', RC);
} 

function MY:CreateInv(base) {
  series = base < 0;
  :SetName(series, :GetName(base) + '.inv');
  :SetTitle(series, :GetTitle(base));
  :SetSource(series, '[DERIVED]');
  :SetNotes(series, :GetNotes(base));
  :GPut(:GetName(series), series);
}

function MY:CreatePC1(base, freq) {
  series = :PChange(base, freq);
  :SetName(series, :GetName(base) + '.pc1');
  :SetTitle(series, :GetTitle(base) + ' (YoY Percentage Change)');
  :SetSource(series, '[DERIVED]');
  :SetNotes(series, :GetNotes(base));
  :GPut(:GetName(series), series);
}

function MY:CreatePC1WithLimit(base, freq, limit) {
  series = :PChange(base, freq);
  series = :Min(series, +limit);
  series = :Max(series, -limit);
  :SetName(series, :GetName(base) + '.pc1');
  :SetTitle(series, :GetTitle(base) + ' (YoY Percentage Change)');
  :SetSource(series, '[DERIVED]');
  :SetNotes(series,
    '<strong>Note:</strong> I have capped percentage changes to +/- ' + limit +
    '%\n\n' + :GetNotes(base));
  :GPut(:GetName(series), series);
}

function MY:CreateSP500(r) {
  SP500_EPS = :Sum(SP500_EPS_Q, 4);
  SP500_SALES = :Sum(SP500_SALES_Q, 4);

  SP500_PE = MY:Logf(SP500 / SP500_EPS, r);
  :SetName(SP500_PE, 'SP500_PE');
  :SetTitle(SP500_PE, 'Adjusted SP500 Price / Earnings');
  :SetSource(SP500_PE, '[DERIVED]');

  SP500_PS = MY:Logf(SP500 / SP500_SALES, r);
  :SetName(SP500_PS, 'SP500_PS');
  :SetTitle(SP500_PS, 'Adjusted SP500 Price / Sales');
  :SetSource(SP500_PS, '[DERIVED]');

  SP500_EY = SP500_EPS / SP500 * 100;
  :SetName(SP500_EY, 'SP500_EY');
  :SetTitle(SP500_EY, 'S&P 500 Earnings Yield (Unadjusted)');
  :SetSource(SP500_EY, '[DERIVED]');

  #MKCAPGDP = 100 * MY:Logf(WILL5000PRFC / GDP, r);
  #:SetName(MKCAPGDP, 'MKCAPGDP');
  #:SetTitle(MKCAPGDP, 'Market Cap to GDP');
  #:SetSource(MKCAPGDP, '[DERIVED]');
  #DESC = 'Adjusted Market Cap to GDP with:\n\n' +
  #  'K=' + LOGF.K + '\n' +
  #  'NR=' + LOGF.NR;
  #:SetNotes(MKCAPGDP, DESC);

  MKCAPGDP2 = 100 * MY:Logf(WILL5000PR / GDP, r);
  :SetName(MKCAPGDP2, 'MKCAPGDP2');
  :SetTitle(MKCAPGDP2, 'Market Cap to GDP');
  :SetSource(MKCAPGDP2, '[DERIVED]');
  DESC = 'Adjusted Market Cap to GDP with:\n\n' +
    'K=' + LOGF.K + '\n' +
    'NR=' + LOGF.NR;
  :SetNotes(MKCAPGDP2, DESC);

  #K = :DlgInput("Enter the value for K:");
  #if (K == null) {
  #  throw 'Operation aborted by user';
  #}
  #K = parseFloat(K);
  #if (K == null) {
  #  throw 'Invalid value for K';
  #}
  K = 10;
  
  SP500GDP = 100 * MY:Logf(SP500 / GDP, r) * K;
  :SetName(SP500GDP, 'SP500GDP');
  :SetTitle(SP500GDP, 'SP500 to GDP');
  :SetSource(SP500GDP, '[DERIVED]');
  DESC = 'Adjusted SP500 to GDP with:\n\n' +
    'LOGF.K=' + LOGF.K + '\n' +
    'LOGF.NR=' + LOGF.NR + '\n' +
    'K=' + K;
  :SetNotes(SP500GDP, DESC);

  :GPut(:GetName(SP500_PE), SP500_PE);
  :GPut(:GetName(SP500_PS), SP500_PS);
  :GPut(:GetName(SP500_EY), SP500_EY);
  #:GPut(:GetName(MKCAPGDP), MKCAPGDP);
  :GPut(:GetName(SP500GDP), SP500GDP);
  :GPut(:GetName(MKCAPGDP2), MKCAPGDP2);
}

function MY:CreateJU() {
  JU = JTSJOL / UNEMPLOY;
  :SetName(JU, 'JU');
  :SetTitle(JU, 'Job Openings / Unemployment');
  :SetSource(JU, '[DERIVED]');
  :GPut(:GetName(JU), JU);
}

function MY:CreateVIX() {
  VIXCLS.H = VIXCLS > 36;
  :SetName(VIXCLS.H, 'VIXCLS.H');
  :SetTitle(VIXCLS.H, :GetTitle(VIXCLS));
  :SetSource(VIXCLS.H, '[DERIVED]');
  :SetNotes(VIXCLS.H, 'Condition is true when VIXCLS > 36');
  :GPut(:GetName(VIXCLS.H), VIXCLS.H);
}

function MY:CreateDGS1FC() {
  DGS1.fc = (100 + DGS2)^2 / (100 + DGS1) - 100;
  :SetName(DGS1.fc, 'DGS1.fc');
  :SetTitle(DGS1.fc, '1-year DGS1 Forecasted Rate');
  :SetSource(DGS1.fc, '[DERIVED]');
  :GPut(:GetName(DGS1.fc), DGS1.fc);
}

function MY:CreateWALCL() {
  X = WALCL / 1000;
  :SetName(X, :GetName(WALCL));
  :SetTitle(X, :GetTitle(WALCL));
  :SetSource(X, :GetSource(WALCL));
  :SetSource(X, :GetSourceId(WALCL));
  :SetUnits(X, 'Billions of Dollars');
  :SetUnitsShort(X, 'Bil. of $');
  :SetNotes(X, :GetNotes(WALCL));
  :GPut('WALCL', X);
}

function MY:CreateICSA() {
  X = :Min(600, ICSA / 1000);
  :SetName(X, :GetName(ICSA));
  :SetTitle(X, :GetTitle(ICSA));
  :SetSource(X, :GetSource(ICSA));
  :SetSourceId(X, :GetSourceId(ICSA));
  :SetUnits(X, 'Level in Thousands');
  :SetUnitsShort(X, 'Level in Thous.');
  :SetNotes(X, :GetNotes(ICSA));
  :GPut('ICSA', X);
}

