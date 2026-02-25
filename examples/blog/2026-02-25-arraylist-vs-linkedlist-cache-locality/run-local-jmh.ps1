$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$resultDir = Join-Path $scriptDir 'results'
$jarPath = Join-Path $scriptDir 'target\jmh-benchmarks.jar'
$pomPath = Join-Path $scriptDir 'pom.xml'
$mvnwCmd = Join-Path $scriptDir 'mvnw.cmd'

$mode = 'full'
$smoke = $false

foreach ($arg in $args) {
    switch ($arg) {
        '--smoke' {
            $smoke = $true
        }
        '--quick' {
            $mode = 'quick'
        }
        default {
            throw "Unknown argument: $arg`nSupported arguments: --smoke, --quick"
        }
    }
}

if ($smoke) {
    & $mvnwCmd -B -ntp -f $pomPath clean package
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }

    & java -jar $jarPath -l
    exit $LASTEXITCODE
}

New-Item -Path $resultDir -ItemType Directory -Force | Out-Null

& $mvnwCmd -B -ntp -f $pomPath clean package
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

if ($mode -eq 'quick') {
    $wi = 1
    $i = 2
    $w = '150ms'
    $r = '150ms'
    $outJson = Join-Path $resultDir 'jmh-result-quick.json'
    $outTxt = Join-Path $resultDir 'jmh-result-quick.txt'
}
else {
    $wi = 5
    $i = 8
    $w = '300ms'
    $r = '300ms'
    $outJson = Join-Path $resultDir 'jmh-result.json'
    $outTxt = Join-Path $resultDir 'jmh-result.txt'
}

& java -jar $jarPath `
    io.clickin.bench.ListAndDequeBenchmark `
    -wi $wi `
    -i $i `
    -w $w `
    -r $r `
    -f 1 `
    -tu ns `
    -jvmArgs '-Xms1g -Xmx1g' `
    -rf json `
    -rff $outJson `
    -o $outTxt

if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

$javaVersionPath = Join-Path $resultDir 'java-version.txt'
$javaVersionStdoutPath = Join-Path $resultDir 'java-version.stdout.txt'
$javaVersionProcess = Start-Process `
    -FilePath 'java' `
    -ArgumentList '-version' `
    -NoNewWindow `
    -Wait `
    -PassThru `
    -RedirectStandardError $javaVersionPath `
    -RedirectStandardOutput $javaVersionStdoutPath

if (Test-Path $javaVersionStdoutPath) {
    if ((Get-Item $javaVersionStdoutPath).Length -gt 0) {
        Get-Content $javaVersionStdoutPath | Add-Content -Path $javaVersionPath
    }
    Remove-Item $javaVersionStdoutPath -Force
}

if ($javaVersionProcess.ExitCode -ne 0) {
    exit $javaVersionProcess.ExitCode
}

$lscpuPath = Join-Path $resultDir 'lscpu.txt'
$cpuInfo = Get-CimInstance Win32_Processor |
    Select-Object Name, Manufacturer, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed, L2CacheSize, L3CacheSize |
    Format-List |
    Out-String

@(
    'Windows host detected. lscpu is not available; generated equivalent summary from Win32_Processor.'
    ''
    $cpuInfo.TrimEnd()
) | Out-File -FilePath $lscpuPath -Encoding utf8

Write-Host "JMH ($mode) results written to $resultDir"
