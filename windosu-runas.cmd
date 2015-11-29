:: Template Elevated Command
:: http://ss64.com/vb/syntax-elevate.html

@Echo off

Set DIR={{ dir }}
Set INPUT={{ input }}
Set OUTPUT={{ output }}
Set CLI_WIDTH={{ cliWidth }}
Set PIPE={{ pipe }}

:: Hide the window
IF [%1]==[] (
   wscript.exe {{ invisible }} "cmd /C %~f0 run"
) else (
   
   cd /D %DIR%

   %PIPE% read client %INPUT% | ({{ command }}) {{ stderr_redir }} | %PIPE% write client %OUTPUT% 
   
)
