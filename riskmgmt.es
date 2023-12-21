function printStats() {
  ES:Print('Cash = ' + CASH);
  ES:Print('FI = ' + FI);
  ES:Print('HIU = ' + HIU);
  ES:Print('HSD = ' + HSD);
  ES:Print('Total = ' + TOTAL);
  ES:Print('Percent Change = ' + ES:PercentChange(TOTAL0, TOTAL) + '%');
  ES:Print();
}

CASH = CASH0 = 50 + 26 + 30 + 24.5 + 24 + 20 + 11.5 + 38.4;
FI = FI0 = 67.5 + 32;
HIU = HIU0 = 56.9;
HSD = HSD0 = 29.2;
TOTAL = TOTAL0 = CASH + FI + HIU + HSD;

ES:Print('Initial Position');
ES:Print('----------------');
printStats();

CASH = CASH0 * 1.05;
FI = FI0 * 1.03;
HIU = HIU0 + HIU0 * ES:PercentInverse(100) / 100;
HSD = HSD0 + HSD0 * ES:PercentInverse(100 * 2) / 100;
TOTAL = CASH + FI + HIU + HSD;
ES:Print('Scenario #1: increase of 100% over 1 year');
ES:Print('-----------------------------------------');
printStats();

CASH = CASH0 * 1.05;
FI = FI0 * 1.03;
HIU = HIU0 + HIU0 * ES:PercentInverse(50) / 100;
HSD = HSD0 + HSD0 * ES:PercentInverse(50 * 2) / 100;
TOTAL = CASH + FI + HIU + HSD;
ES:Print('Scenario #2: increase of 50% over 1 year');
ES:Print('-----------------------------------------');
printStats();

CASH = CASH0 * 1.05;
FI = FI0 * 1.06;
HIU = HIU0 + HIU0 * ES:PercentInverse(ES:PercentInverse(100)) / 100;
HSD = HSD0 + HSD0 * ES:PercentInverse(ES:PercentInverse(100 * 2)) / 100;
TOTAL = CASH + FI + HIU + HSD;
ES:Print('Scenario #3: decrease of 50% over 1 year');
ES:Print('----------------------------------------');
printStats();

CASH = CASH0 * 1.05;
FI = FI0 * 1.06;
HIU = HIU0 + HIU0 * ES:PercentInverse(ES:PercentInverse(50)) / 100;
HSD = HSD0 + HSD0 * ES:PercentInverse(ES:PercentInverse(50 * 2)) / 100;
TOTAL = CASH + FI + HIU + HSD;
ES:Print('Scenario #4: decrease of 33% over 1 year');
ES:Print('----------------------------------------');
printStats();

