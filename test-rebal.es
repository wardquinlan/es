function rebal() {
  include 'test-input.es';
  reload();

  SP500GDP = ES:Chop(SP500GDP, start, start + period);
  eq = ES:Transform(ES:Get(SP500GDP, 0), 60, 180, 75, 0);
  ES:Print('equity allocation=' + eq);
  net = net * eq / 100;
  ES:Print('net position=' + net); 
}

