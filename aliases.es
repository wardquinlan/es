function ds() {
  :Ds();
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

updateAll = ES:UpdateAll;
usage     = ES:Usage;

reload = MY:Reload;
plot   = MY:Plot;
input  = MY:Input;
sp500  = MY:SP500;
view   = MY:View;

