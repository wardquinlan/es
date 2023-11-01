:SystemAlias('salias', ':SystemAlias');
salias('ualias', ':UserAlias');
salias('functions', ':Functions');
salias('help', ':Help');
salias('ds', ':Ds');
salias('cat', ':Cat');
salias('status', ':Status');
salias('data', ':Data');
salias('meta', ':Meta');
salias('exit', ':Exit');
salias('print', ':Print');
salias('getEnv', ':GetEnv');
salias('getLength', ':GetLength');
salias('iterate', ':Iterate');

function info() {
  :SetLogLevel(INFO);
}

function debug() {
  :SetLogLevel(DEBUG);
}

function subString(obj, beginIndex, endIndex) {
  if (endIndex == null) {
    return :SubString(obj, beginIndex);
  } else {
    return :SubString(obj, beginIndex, endIndex);
  }
}

update        = ES:Update;
usage         = ES:Usage;
defaults      = ES:Defaults;
load          = ES:Load;
startsWith    = ES:StartsWith;
endsWith      = ES:EndsWith;
assert        = ES:Assert;
checkMetaData = ES:CheckMetaData;
lastUpdated   = ES:LastUpdated;

reload     = MY:Reload;
plot       = MY:Plot;
input      = MY:Input;
sp500      = MY:SP500;
view       = MY:View;
summary    = MY:Summary;
updateMain = MY:UpdateMain;

