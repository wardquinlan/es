function getIndex(S, flag) {
  if (flag == 'B') {
    idx = 0;
  } else {
    idx = ES:GetSize(S) - 1;
  }
  return idx;
}

function rebal() {
  include 'test-input.es';
  reload();

  SP500GDP = ES:Chop(SP500GDP, start, start + period);
  idxe = getIndex(SP500GDP, flag);
  eq = ES:Transform(ES:Get(SP500GDP, idxe), 60, 180, 75, 0);
  eq = net * eq / 100;

  DTB3 = ES:Chop(DTB3, start, start + period);
  DGS10 = ES:Chop(DGS10, start, start + period);

  idxc = getIndex(DTB3, flag);
  c = ES:Get(DTB3, idxc);

  idxd = getIndex(DGS10, flag);
  d = ES:Get(DGS10, idxd);

  total = c + d;
  c = c / total;
  d = d / total;
  cash = c * (net - eq);
  duration = d * (net - eq);

  ES:Print(date + ' cash position=' + cash + ' (' + (cash * 100 / net) + '%)');
  ES:Print(date + ' duration position=' + duration + ' (' + (duration * 100 / net) + '%)');
  ES:Print(date + ' equity position=' + eq + '(' + (eq *100 / net) + '%)'); 
  ES:Print(date + ' net position=' + (eq + cash + duration));
}

