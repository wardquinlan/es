function ds() {
  :Ds();
}

function cat() {
  :Cat();
}

function status() {
  :Status();
}

function data(obj) {
  :Data(obj);
}

function meta(obj) {
  :Meta(obj);
}

function info() {
  :SetLogLevel(INFO);
}

function debug() {
  :SetLogLevel(DEBUG);
}

function exit() {
  :Exit();
}

function print(obj) {
  :Print(obj);
}

function getEnv(obj) {
  return :GetEnv(obj);
}

function getLength(obj) {
  return :GetLength(obj);
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

reload     = MY:Reload;
plot       = MY:Plot;
input      = MY:Input;
sp500      = MY:SP500;
view       = MY:View;
summary    = MY:Summary;

