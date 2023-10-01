#!/bin/sh

JAVA_HOME=/home/ward/java-se-8u41-ri
export JAVA_HOME
ES_HOME=/home/ward/workspace/econ/output
export ES_HOME

$ES_HOME/es.sh --suppress-prompt << EOF
  ds(updateSeries);
EOF

