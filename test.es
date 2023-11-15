function test() {
  d = :DlgInput('Enter the start date:');
  d = :Date(d);

  period = :DlgInput('Enter the period:');
  period = :ParseInt(period);

  S = :Load(3);
  S = ES:Chop(S, d, d + period);
  :Print('annual cash yield=' + :Get(S, 0));

  S = :Load(120);
  S = ES:Chop(S, d, d + period);
  :Print('annual duration yield (B)=' + :Get(S, 0));
  :Print('annual duration yield (E)=' + :Get(S, :GetSize(S) - 1));

  S = :Load(500);
  S = ES:Chop(S, d, d + period);
  :Print('equity value (B)=' + :Get(S, 0));
  :Print('equity value (E)=' + :Get(S, :GetSize(S) - 1));
}

