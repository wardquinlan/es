SP500 = load(500);
SP500_EPS_Q = load(512);
SP500_EPS = sum(SP500_EPS_Q, 4);
SP500_PE = LOGF * SP500 / SP500_EPS;
setName(SP500_PE, "SP500_PE");
setTitle(SP500_PE, "Adjusted SP500 Price / Earnings");
setSource(SP500_PE, "[DERIVED]");
SP500_EY = SP500_EPS / SP500 * 100;
setName(SP500_EY, "SP500_EY");
setTitle(SP500_EY, "S&P 500 Earnings Yield (Unadjusted)");
setSource(SP500_EY, "[DERIVED]");
SP500_EPS = NULL;
SP500_EPS_Q = NULL;

SP500_SALES_Q = load(510);
SP500_SALES = sum(SP500_SALES_Q, 4);
SP500_PS = LOGF * SP500 / SP500_SALES;
setName(SP500_PS, "SP500_PS");
setTitle(SP500_PS, "Adjusted SP500 Price / Sales");
setSource(SP500_PS, "[DERIVED]");
SP500_SALES = NULL;
SP500_SALES_Q = NULL;

