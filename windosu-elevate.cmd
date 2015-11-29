:: Template Elevated Command
:: http://ss64.com/vb/syntax-elevate.html

@Echo off

Set _temp={{ temp }}
Set _tempfile=%_temp%SaveDrives.txt
Set _tempvbs=%_temp%getadmin.vbs
Set DIR={{ dir }}
Set INPUT={{ input }}
Set OUTPUT={{ output }}
Set ERROR={{ error }}
Set CLI_WIDTH={{ cliWidth }}
Set PIPE={{ pipe }}

set FIND=%SystemRoot%\System32\Find

:: Check for admin permissions
OPENFILES > nul 2> nul
:: If error flag set, we do not have admin.
If ERRORLEVEL 1 (
   Echo Requesting administrative privileges...
   Goto sub_elevate
) Else ( Goto sub_main )

:sub_elevate

:: Save the current drive mappings to a temp file
   Del %_tempfile% 2>Nul
   For /f "tokens=2" %%G in ('net use ^| %FIND% ":"') do (call :sub_save_drive %%G)

:: Create a temporary VBScript
   Echo Set objShell = CreateObject^("Shell.Application"^) > %_tempvbs%
   Echo objShell.ShellExecute "%~f0", "", "", "runas", 0 >> %_tempvbs%

:: Relaunch this script 'As Admin'
   cscript "%_tempvbs%" //nologo
   Exit /B

:sub_save_drive
   Set _drive=%1
   For /f "tokens=2,*" %%I in ('Net Use %_drive% ^| %FIND% "\\"') Do (Set _Path=%%J)
   Echo %_drive%~%_Path%>>%_tempfile%
   Goto :eof

:sub_main
:--------------------------------------
:: At this point we should be running under an Admin token

:: Hide the window
IF [%1]==[] (
   wscript.exe "{{ invisible }}" "cmd /C %~f0 run"
) else (

   If exist "%_tempvbs%" ( Del "%_tempvbs%" )

   :: Re-Map the drives listed in the temp file (if any)
   For /f "tokens=1,2 delims=~" %%G in (%_tempfile%) do (Net Use %%G /delete /y & Net Use %%G "%%H" /persistent:no)

   If exist "%_tempfile%" ( Del "%_tempfile%" )

   cd /D %DIR%

   %PIPE% read client %INPUT% | ({{ command }}) {{ stderr_redir }} | %PIPE% write client %OUTPUT% 
)