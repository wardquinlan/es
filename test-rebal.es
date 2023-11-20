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
  ES:Print(ES:ToString(ES:GetDate(SP500GDP, idx)) + ' equity allocation=' + eq);
  net = net * eq / 100;
  ES:Print(ES:ToString(ES:GetDate(SP500GDP, idx)) + ' net position=' + net); 
}

