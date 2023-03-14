DTB3 = load(3);
DGS1 = load(12);
DGS2 = load(24);
DGS10 = load(120);
SOFR = load(17);

DGS1.fc= (100 + DGS2)^2 / (100 + DGS1) - 100;
setName(DGS1.fc, "DGS1.fc");
setTitle(DGS1.fc, "1-year DGS1 Forecasted Rate");
setSource(DGS1.fc, "[DERIVED]");

TED = SOFR - DTB3;
setName(TED, "TED");
setTitle(TED, "TED Rate");
setNotes(TED, "Defined as SOFR - DTB3");

