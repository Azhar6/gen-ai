@echo off
cd /d "%~dp0"
echo Open this URL on your phone or PC, then tap Install / Add to Home Screen:
echo http://localhost:4173/
python -m http.server 4173
