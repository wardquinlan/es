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
  idx = getIndex(SP500GDP, flag);
  eq = ES:Transform(ES:Get(SP500GDP, idx), 60, 180, 75, 0);
  eq = net * eq / 100;
  ES:Print(date + ' equity position=' + eq + '(' + (eq *100 / net) + '%)'); 

  DTB3 = ES:Chop(DTB3, start, start + period);
  DGS10 = ES:Chop(DGS10, start, start + period);

  idxc = getIndex(DTB3, flag);
  c = ES:Get(DTB3, idx);

  idxd = getIndex(DGS10, flag);
  d = ES:Get(DGS10, idx);

  total = c + d;
  c = c / total;
  d = d / total;
  cash = c * (net - eq);
  duration = d * (net - eq);

  ES:Print(date + ' cash allocation=' + cash + ' (' + (cash * 100 / net) + '%)');
  ES:Print(date + ' duration allocation=' + duration + ' (' + (duration * 100 / net) + '%)');
  ES:Print(date + ' net allocation=' + (eq + cash + duration));
}

