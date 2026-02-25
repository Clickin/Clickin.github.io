#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RESULT_DIR="${SCRIPT_DIR}/results"
JAR_PATH="${SCRIPT_DIR}/target/jmh-benchmarks.jar"

if [[ "${1:-}" == "--smoke" ]]; then
  "${SCRIPT_DIR}/mvnw" -B -ntp -f "${SCRIPT_DIR}/pom.xml" clean package
  java -jar "${JAR_PATH}" -l
  exit 0
fi

MODE="full"
if [[ "${1:-}" == "--quick" ]]; then
  MODE="quick"
fi

mkdir -p "${RESULT_DIR}"

"${SCRIPT_DIR}/mvnw" -B -ntp -f "${SCRIPT_DIR}/pom.xml" clean package

if [[ "${MODE}" == "quick" ]]; then
  WI=1
  I=2
  W=150ms
  R=150ms
  OUT_JSON="${RESULT_DIR}/jmh-result-quick.json"
  OUT_TXT="${RESULT_DIR}/jmh-result-quick.txt"
else
  WI=5
  I=8
  W=300ms
  R=300ms
  OUT_JSON="${RESULT_DIR}/jmh-result.json"
  OUT_TXT="${RESULT_DIR}/jmh-result.txt"
fi

java -jar "${JAR_PATH}" \
  io.clickin.bench.ListAndDequeBenchmark \
  -wi "${WI}" \
  -i "${I}" \
  -w "${W}" \
  -r "${R}" \
  -f 1 \
  -tu ns \
  -jvmArgs "-Xms1g -Xmx1g" \
  -rf json \
  -rff "${OUT_JSON}" \
  -o "${OUT_TXT}"

java -version > "${RESULT_DIR}/java-version.txt" 2>&1
lscpu > "${RESULT_DIR}/lscpu.txt"

echo "JMH (${MODE}) results written to ${RESULT_DIR}"
