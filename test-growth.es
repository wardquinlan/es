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
}

