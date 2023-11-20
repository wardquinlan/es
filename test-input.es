start = ES:DlgInput('Enter the start date:');
start = ES:Date(start);

period = ES:DlgInput('Enter the period:');
period = ES:ParseInt(period);

net = ES:DlgInput('Enter the net position:');
net = ES:ParseFloat(net);

flag = ES:DlgInput('Enter Begin (B) or End (E) of period flag:');
if (flag != 'B' and flag != 'E') {
  throw 'Invalid flag: ' + flag;
}

