:Alias('alias', ':Alias');
alias('ds', ':Ds');
alias('cat', ':Cat');
alias('status', ':Status');
alias('data', ':Data');
alias('meta', ':Meta');
alias('exit', ':Exit');
alias('print', ':Print');
alias('getEnv', ':GetEnv');
alias('getLength', ':GetLength');

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

updateAll  = ES:UpdateAll;
usage      = ES:Usage;
defaults   = ES:Defaults;
load       = ES:Load;
startsWith = ES:StartsWith;
endsWith   = ES:EndsWith;
assert     = ES:Assert;

reload     = MY:Reload;
plot       = MY:Plot;
input      = MY:Input;
sp500      = MY:SP500;
view       = MY:View;
summary    = MY:Summary;

