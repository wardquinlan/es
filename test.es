function test() {
  reload();
  ES:Print('SP500GDP=' + SP500GDP);

  d = ES:DlgInput('Enter the start date:');
  d = ES:Date(d);

  period = ES:DlgInput('Enter the period:');
  period = :ParseInt(period);

  S = ES:Chop(SP500GDP, d, d + period);
  ES:Print(ES:ToString(ES:GetDate(S, 0)) + ': SP500GDP (B)=' + ES:Get(S, 0));

  S = ES:Load(3);
  S = ES:Chop(S, d, d + period);
  ES:Print('Date (B): ' + ES:ToString(ES:GetDate(S, 0)));
  ES:Print('Date (E): ' + ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)));
  ES:Print(ES:ToString(ES:GetDate(S, 0)) + ': annual cash yield (B)=' + ES:Get(S, 0));
  y = ES:PeriodYield(ES:Get(S, 0), period);
  ES:Print(ES:ToString(ES:GetDate(S, 0)) + ': period cash yield (B)=' + y);
  cy = y;
  ES:Print(ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)) + ': annual cash yield (E)=' +
    ES:Get(S, ES:GetSize(S) - 1));
  y = ES:PeriodYield(ES:Get(S, ES:GetSize(S) - 1), period);
  ES:Print(ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)) + ': period cash yield (E)=' + y);

  S = ES:Load(120);
  S = ES:Chop(S, d, d + period);
  ES:Print(ES:ToString(ES:GetDate(S, 0)) + ': annual duration yield (B)=' + ES:Get(S, 0));
  y = ES:PeriodYield(ES:Get(S, 0), period);
  dy = y;
  ES:Print(ES:ToString(ES:GetDate(S, 0)) + ': period duration yield (B)=' + y);
  ES:Print(ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)) + 
    ': annual duration yield (E)=' + ES:Get(S, ES:GetSize(S) - 1));
  y = ES:PeriodYield(ES:Get(S, ES:GetSize(S) - 1), period);
  ES:Print(ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)) +
    ': period duration yield (E)=' + y);
  ES:Print('change in annual duration yield=' + (ES:Get(S, ES:GetSize(S) - 1) - ES:Get(S, 0)));
  dpct = dy / (cy + dy);
  ES:Print('computed duration pct=' + dpct);
  cpct = cy / (cy + dy);
  ES:Print('computed cash pct=' + cpct);
  
  S = ES:Load(500);
  S = ES:Chop(S, d, d + period);
  ES:Print(ES:ToString(ES:GetDate(S, 0)) + ': equity value (B)=' + ES:Get(S, 0));
  ES:Print(ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)) + 
    ': equity value (E)=' + ES:Get(S, ES:GetSize(S) - 1));
}

