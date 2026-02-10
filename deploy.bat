@echo off
echo Initializing git... > deploy.log
git init >> deploy.log 2>&1
echo Adding files... >> deploy.log
git add . >> deploy.log 2>&1
echo Committing... >> deploy.log
git commit -m "Initial commit" >> deploy.log 2>&1
echo Renaming branch... >> deploy.log
git branch -M main >> deploy.log 2>&1
echo Adding remote... >> deploy.log
git remote add origin https://github.com/Clickin/Clickin.github.io.git >> deploy.log 2>&1
echo Pushing... >> deploy.log
git push -u origin main --force >> deploy.log 2>&1
echo Done. >> deploy.log
type deploy.log
