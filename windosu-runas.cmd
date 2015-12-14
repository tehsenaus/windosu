:: Template Elevated Command
:: http://ss64.com/vb/syntax-elevate.html

@Echo off

Set DIR={{ dir }}
Set INPUT={{ input }}
Set OUTPUT={{ output }}
Set CLI_WIDTH={{ cliWidth }}
Set PIPE={{ pipe }}
Set _temp={{ temp }}
Set _tempinvisible=%_temp%invisible.vbs

:: Hide the window
IF [%1]==[] (
   Echo CreateObject^("Wscript.Shell"^).Run "" ^& WScript.Arguments^(0^) ^& "", 0, False > %_tempinvisible%
   wscript.exe %_tempinvisible% "cmd /C %~f0 run"
   Del %_tempinvisible%
) else (
   
   cd /D %DIR%

   %PIPE% read client %INPUT% | ({{ command }}) {{ stderr_redir }} | %PIPE% write client %OUTPUT% 
   
)
