function test() {
  reload();
  ES:Print('SP500GDP=' + SP500GDP);

  d = ES:DlgInput('Enter the start date:');
  d = ES:Date(d);

  period = ES:DlgInput('Enter the period:');
  period = ES:ParseInt(period);

  cash = ES:DlgInput('Enter Cash at beginning of period:');
  cash = ES:ParseFloat(cash);

  duration = ES:DlgInput('Enter Duration at beginning of period:');
  duration = ES:ParseFloat(duration);

  equity = ES:DlgInput('Enter Equity at beginning of period:');
  equity = ES:ParseFloat(equity);

  S = ES:Chop(SP500GDP, d, d + period);
  ES:Print(ES:ToString(ES:GetDate(S, 0)) + ': SP500GDP (B)=' + ES:Get(S, 0));

  S = ES:Load(3);
  S = ES:Chop(S, d, d + period);
  ES:Print('Date (B): ' + ES:ToString(ES:GetDate(S, 0)));
  ES:Print('Date (E): ' + ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)));
  y = ES:PeriodYield(ES:Get(S, 0), period);
  ES:Print(ES:ToString(ES:GetDate(S, 0)) + ': period cash yield (B)=' + y);
  ES:Print(ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)) + ': period cash balance (E)=' + 
    cash * (100 + y) / 100);
  net = cash * (100 + y) / 100;
  y = ES:PeriodYield(ES:Get(S, ES:GetSize(S) - 1), period);
  ES:Print(ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)) + ': period cash yield (E)=' + y);
  cy = y;

  S = ES:Load(120);
  S = ES:Chop(S, d, d + period);
  y = ES:PeriodYield(ES:Get(S, 0), period);
  ES:Print(ES:ToString(ES:GetDate(S, 0)) + ': period duration yield (B)=' + y);
  y = ES:PeriodYield(ES:Get(S, ES:GetSize(S) - 1), period);
  dy = y;
  ES:Print(ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)) +
    ': period duration yield (E)=' + y);
  durationGain = -8 * (ES:Get(S, ES:GetSize(S) - 1) - ES:Get(S, 0));
  ES:Print(ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)) +
    ': period duration gain (E)=' + durationGain);
  ES:Print(ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)) +
    ': period duration balance (E)=' + duration * (100 + dy + durationGain) / 100);
  net = net + duration * (100 + dy + durationGain) / 100;
  
  dpct = dy / (cy + dy);
ES:Print(dpct);
  cpct = cy / (cy + dy);
ES:Print(cpct);
  
  S = ES:Load(500);
  S = ES:Chop(S, d, d + period);
  ES:Print(ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)) +
    ': period equity gain (E)=' + (ES:Get(S, ES:GetSize(S) - 1) - ES:Get(S, 0)) / ES:Get(S, 0) * 100);
  val = equity * (1 + ((ES:Get(S, ES:GetSize(S) - 1) - ES:Get(S, 0)) / ES:Get(S, 0)));
  ES:Print(ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)) + 
    ': period equity balance (E)=' + val);
  net = net + val;
  ES:Print(ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)) + ' period net balance (E)=' + net);

  SP500GDP = ES:Chop(SP500GDP, d, d + period);
  eq = ES:Transform(ES:Get(SP500GDP, 0), 60, 180, 75, 0);
  ES:Print(ES:ToString(ES:GetDate(SP500GDP, 0)) + 
    ' equity allocation (B)=' + eq);

  eq = ES:Transform(ES:Get(SP500GDP, ES:GetSize(SP500GDP) - 1), 60, 180, 75, 0);
  ES:Print(ES:ToString(ES:GetDate(SP500GDP, ES:GetSize(SP500GDP) - 1)) + 
    ' equity allocation (R)=' + eq);
  ES:Print(ES:ToString(ES:GetDate(SP500GDP, ES:GetSize(SP500GDP) - 1)) + 
    ' equity allocation (R)=' + eq * net / 100);

  net = net - eq * net / 100;
  S = ES:Load(120);
  S = ES:Chop(S, d, d + period);
  ES:Print(ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)) +
    ' duration allocation (R)=' + dpct * net); 
  net = net - dpct * net;
  ES:Print(ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)) +
    ' cash allocation (R)=' + net); 
}

