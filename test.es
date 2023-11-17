function test() {
  d = ES:DlgInput('Enter the start date:');
  d = ES:Date(d);

  period = ES:DlgInput('Enter the period:');
  period = :ParseInt(period);

  S = ES:Load(3);
  S = ES:Chop(S, d, d + period);
  ES:Print(ES:ToString(ES:GetDate(S, 0)) + ': annual cash yield (B)=' + :Get(S, 0));

  S = ES:Load(120);
  S = ES:Chop(S, d, d + period);
  ES:Print(ES:ToString(ES:GetDate(S, 0)) + ': annual duration yield (B)=' + :Get(S, 0));
  ES:Print(ES:ToString(ES:GetDate(S, ES:GetSize(S) - 1)) + 
    ': annual duration yield (E)=' + :Get(S, :GetSize(S) - 1));

  S = ES:Load(500);
  S = ES:Chop(S, d, d + period);
  ES:Print(ES:ToString(ES:GetDate(S, 0)) + ': equity value (B)=' + :Get(S, 0));
  ES:Print(ES:ToString(ES:GetDate(S, :GetSize(S) - 1)) + 
    ': equity value (E)=' + :Get(S, :GetSize(S) - 1));
}

