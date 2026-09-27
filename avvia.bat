@echo off
title EcosiStem - Portale Didattico STEM
echo ========================================================
echo          Avvio Portale Didattico EcosiStem
echo ========================================================
echo Server PHP locale in esecuzione su http://localhost:8000
echo Premi CTRL+C per arrestare il server.
echo.
start http://localhost:8000
php -S localhost:8000 -t public
pause
