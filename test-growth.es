function getIndex(S, flag) {
  if (flag == 'B') {
    idx = 0;
  } else {
    idx = ES:GetSize(S) - 1;
  }
  return idx;
}

function growth() {
  start = ES:DlgInput('Enter the start date:');
  start = ES:Date(start);

  period = ES:DlgInput('Enter the period:');
  period = ES:ParseInt(period);
  
  cash = ES:DlgInput('Enter the cash position:');
  cash = ES:ParseFloat(cash);

  duration = ES:DlgInput('Enter the duration position:');
  duration = ES:ParseFloat(duration);

  equity = ES:DlgInput('Enter the equity position:');
  equity = ES:ParseFloat(equity);

  reload();

  DTB3 = ES:Chop(DTB3, start, start + period);
  DGS10 = ES:Chop(DGS10, start, start + period);
  SP500 = ES:Chop(SP500, start, start + period);

  idxCash = getIndex(DTB3, 'B');
  acy = ES:Get(DTB3, idxCash);
  pcy = ES:PeriodYield(acy, period);
  ES:Print(ES:ToString(start) + ': annual cash yield=' + acy);
  ES:Print(ES:ToString(start) + ': period cash yield=' + pcy);
  ES:Print(ES:ToString(start) + ': opening cash balance=' + cash);
  ES:Print(ES:ToString(start + period) + ': closing cash balance=' + cash * (100 + pcy) / 100);

  idxDuration = getIndex(DGS10, 'B');
  ady = ES:Get(DGS10, idxDuration);
  pdy = ES:PeriodYield(ady, period);
  ES:Print(ES:ToString(start) + ': annual duration yield=' + ady);
  ES:Print(ES:ToString(start) + ': period duration yield=' + pdy);
  ES:Print(ES:ToString(start) + ': opening duration balance=' + duration);

  idxDuration2 = getIndex(DGS10, 'E');
  ady2 = ES:Get(DGS10, idxDuration2);
  delta = ady2 - ady;
  gain = -8 * delta;
  ES:Print(ES:ToString(start + period) + ': duration gain=' + gain);
  ES:Print(ES:ToString(start + period) + ': net duration return=' + (gain + pdy));
  ES:Print(ES:ToString(start + period) + ': closing duration balance=' + 
    duration * (100 + gain + pdy) / 100);
}

