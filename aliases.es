:SystemAlias('sysalias', ':SystemAlias');
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
sysalias('getEnv', ':GetEnv');
sysalias('getLength', ':GetLength');
sysalias('iterate', ':Iterate');

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

