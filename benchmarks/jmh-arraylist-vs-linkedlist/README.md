# JMH: ArrayList vs LinkedList vs ArrayDeque

This module provides reproducible JMH benchmarks used by the blog draft.

## What it measures

- `arrayListGetMiddle` vs `linkedListGetMiddle`
- `arrayListIterate` vs `linkedListIterate`
- `arrayDequeOfferPoll` vs `linkedListDequeOfferPoll`

## Local run

```bash
mvn -B -ntp -f benchmarks/jmh-arraylist-vs-linkedlist/pom.xml clean package
java -jar benchmarks/jmh-arraylist-vs-linkedlist/target/jmh-benchmarks.jar \
  io.clickin.bench.ListAndDequeBenchmark \
  -wi 5 -i 8 -w 300ms -r 300ms -f 1 -tu ns \
  -jvmArgs "-Xms1g -Xmx1g" \
  -rf json -rff benchmarks/jmh-arraylist-vs-linkedlist/results/jmh-result.json
```

## GitHub Actions

Workflow: `.github/workflows/jmh-collections-benchmark.yml`

- Runs on `workflow_dispatch` and relevant pull requests
- Uploads `jmh-result.json`, `jmh-result.txt`, `java-version.txt`, and `lscpu.txt`

## Reproducibility notes

- JIT warmup and runner noise still affect microbenchmarks
- Compare trends, not single-run absolute numbers
- For strict comparison, keep JDK version, JVM flags, and machine class fixed
