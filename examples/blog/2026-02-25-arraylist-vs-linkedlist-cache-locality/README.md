# Blog Example: 2026-02-25-arraylist-vs-linkedlist-cache-locality

- Canonical slug: `/blog/2026-02-25-arraylist-vs-linkedlist-cache-locality`
- Canonical example path in repo: `examples/blog/2026-02-25-arraylist-vs-linkedlist-cache-locality`

This project provides reproducible JMH benchmarks referenced by the blog post.

## Reproduce from a local clone

```bash
git clone https://github.com/<owner>/<repo>.git
cd <repo>
./examples/blog/2026-02-25-arraylist-vs-linkedlist-cache-locality/run-local-jmh.sh
```

Windows PowerShell:

```powershell
.\examples\blog\2026-02-25-arraylist-vs-linkedlist-cache-locality\run-local-jmh.ps1
```

For a quick toolchain check without running full benchmarks:

```bash
./examples/blog/2026-02-25-arraylist-vs-linkedlist-cache-locality/run-local-jmh.sh --smoke
```

```powershell
.\examples\blog\2026-02-25-arraylist-vs-linkedlist-cache-locality\run-local-jmh.ps1 --smoke
```

For quick benchmark numbers:

```bash
./examples/blog/2026-02-25-arraylist-vs-linkedlist-cache-locality/run-local-jmh.sh --quick
```

```powershell
.\examples\blog\2026-02-25-arraylist-vs-linkedlist-cache-locality\run-local-jmh.ps1 --quick
```

Windows Command Prompt (`cmd.exe`) can use the shim:

```bat
examples\blog\2026-02-25-arraylist-vs-linkedlist-cache-locality\run-local-jmh.cmd --quick
```

## What it measures

- `arrayListGetMiddle` vs `linkedListGetMiddle`
- `arrayListFindByValueFirst/Middle/Last` vs `linkedListFindByValueFirst/Middle/Last`
- `arrayListIterate` vs `linkedListIterate`
- `arrayDequeOfferPoll` vs `linkedListDequeOfferPoll`
- `arrayListBuildFromPayload` vs `linkedListBuildFromPayload` (GC profiler로 메모리 할당량 비교용)

## Reproducible build (Maven Wrapper)

```bash
./examples/blog/2026-02-25-arraylist-vs-linkedlist-cache-locality/mvnw \
  -B -ntp \
  -f examples/blog/2026-02-25-arraylist-vs-linkedlist-cache-locality/pom.xml \
  clean package
```

## Run benchmark

```bash
mkdir -p examples/blog/2026-02-25-arraylist-vs-linkedlist-cache-locality/results
java -jar examples/blog/2026-02-25-arraylist-vs-linkedlist-cache-locality/target/jmh-benchmarks.jar \
  io.clickin.bench.ListAndDequeBenchmark \
  -wi 5 -i 8 -w 300ms -r 300ms -f 1 -tu ns \
  -jvmArgs "-Xms1g -Xmx1g" \
  -rf json \
  -rff examples/blog/2026-02-25-arraylist-vs-linkedlist-cache-locality/results/jmh-result.json
```

The script writes benchmark and environment outputs under `results/`:

- `jmh-result.json` / `jmh-result.txt` (or `*-quick.*` when `--quick`)
- `java-version.txt`
- `lscpu.txt` (on Windows, this is a `Win32_Processor` summary with equivalent CPU fields)
