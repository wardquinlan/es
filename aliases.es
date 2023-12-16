:SystemAlias('sysalias', ':SystemAlias');
:SystemAlias('salias', ':SystemAlias');
sysalias('alias', ':UserAlias');
sysalias('functions', ':Functions');
sysalias('help', ':Help');
sysalias('ds', ':Ds');
sysalias('cat', ':Cat');
sysalias('status', ':Status');
sysalias('data', ':Data');
sysalias('meta', ':Meta');
sysalias('exit', ':Exit');
sysalias('print', ':Print');
sysalias('printf', ':Printf');
sysalias('getEnv', ':GetEnv');
sysalias('getLength', ':GetLength');
sysalias('iterate', ':Iterate');
sysalias('parseInt', ':ParseInt');
sysalias('parseFloat', ':ParseFloat');
sysalias('insert', ':Insert');
sysalias('merge', ':Merge');

const function info() {
  :SetLogLevel(INFO);
}

const function debug() {
  :SetLogLevel(DEBUG);
}

const function subString(obj, beginIndex, endIndex) {
  if (endIndex == null) {
    return :SubString(obj, beginIndex);
  } else {
    return :SubString(obj, beginIndex, endIndex);
  }
}

const update        = MY:Update;
const usage         = ES:Usage;
const defaults      = ES:Defaults;
const load          = ES:Load;
const startsWith    = ES:StartsWith;
const endsWith      = ES:EndsWith;
const assert        = ES:Assert;
const checkMetaData = ES:CheckMetaData;
const lastUpdated   = ES:LastUpdated;

const reload     = MY:Reload;
const input      = MY:Input;
const sp500      = MY:SP500;
const view       = MY:View;
const summary    = MY:Summary;
const updateMain = MY:UpdateMain;

