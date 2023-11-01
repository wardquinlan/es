:SystemAlias('sAlias', ':SystemAlias');
sAlias('uAlias', ':UserAlias');
sAlias('functions', ':Functions');
sAlias('help', ':Help');
sAlias('ds', ':Ds');
sAlias('cat', ':Cat');
sAlias('status', ':Status');
sAlias('data', ':Data');
sAlias('meta', ':Meta');
sAlias('exit', ':Exit');
sAlias('print', ':Print');
sAlias('getEnv', ':GetEnv');
sAlias('getLength', ':GetLength');
sAlias('iterate', ':Iterate');

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

