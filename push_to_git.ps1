$env:Path += ";C:\Program Files\Git\cmd"
git init
$email = git config --global user.email
if (-not $email) { git config --global user.email "joshua@example.com" }
$name = git config --global user.name
if (-not $name) { git config --global user.name "Joshua" }
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/joshua468/Nigeria--Voting-App.git
# Use --force just in case the new repo has a README that conflicts
git push -u origin main --force
