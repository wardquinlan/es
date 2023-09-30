. 'functions.es';

ds(autoload);

RC = createRC();
setName(RC, 'RC');

GDP.pc1 = pchange(GDP, 4);
setName(GDP.pc1, "GDP.pc1");
setTitle(GDP.pc1, getTitle(GDP) + ", YoY Percentage Change");
setSource(GDP.pc1, "[DERIVED]");
setNotes(GDP.pc1, getNotes(GDP));

