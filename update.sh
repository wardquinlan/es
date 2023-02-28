#!/bin/sh

JAVA_HOME=/home/ward/java-se-8u41-ri
export JAVA_HOME
ES_HOME=/home/ward/workspace/econ/output
export ES_HOME

update() {
  $ES_HOME/es.sh --suppress-prompt << EOF
  
  print('updating $1...');
  S = fred('$1');
  setId(S, $2);
  merge(S, "--with-inserts");

EOF
}

update DTB3 3
update GDP 10
update DGS1 12
update SOFR 17
updaet NFCI 18
update VIXCLS 23
update DGS2 24
update MICH 29
update UMCSENT 31
update RSAFS 37
update DTWEXBGS 42
updaet PPIACO 47
update PCEPILFE 53
update UNEMPLOY 57
update RRPONTSYD 61
update WALCL 74
update JTSJOL 77
update T5YIE 83
update T10YIE 84
update T10Y2Y 96
update T10Y3M 117
update DGS10 120
update SP500 500
update WILL5000PRFC 5000

