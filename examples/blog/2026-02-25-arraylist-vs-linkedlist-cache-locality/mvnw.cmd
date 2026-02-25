@ECHO OFF
SETLOCAL

SET BASE_DIR=%~dp0
SET WRAPPER_DIR=%BASE_DIR%\.mvn\wrapper
SET WRAPPER_JAR=%WRAPPER_DIR%\maven-wrapper.jar
SET WRAPPER_PROPERTIES=%WRAPPER_DIR%\maven-wrapper.properties

IF NOT EXIST "%WRAPPER_PROPERTIES%" (
  ECHO Missing %WRAPPER_PROPERTIES%
  EXIT /B 1
)

IF NOT EXIST "%WRAPPER_JAR%" (
  FOR /F "tokens=1,* delims==" %%A IN (%WRAPPER_PROPERTIES%) DO (
    IF "%%A"=="wrapperUrl" SET WRAPPER_URL=%%B
  )

  IF "%WRAPPER_URL%"=="" (
    SET WRAPPER_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar
  )

  powershell -NoProfile -Command "Invoke-WebRequest -UseBasicParsing -Uri '%WRAPPER_URL%' -OutFile '%WRAPPER_JAR%'"
)

java -Dmaven.multiModuleProjectDirectory="%BASE_DIR%" -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*

ENDLOCAL
