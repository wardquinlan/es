start = ES:DlgInput('Enter the start date:');
start = ES:Date(start);

period = ES:DlgInput('Enter the period:');
period = ES:ParseInt(period);

net = ES:DlgInput('Enter the net position:');
net = ES:ParseFloat(net);

