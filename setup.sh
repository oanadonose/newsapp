#!/bin/bash

# SETUP SCRIPT
# run this script to install all the required tools and packages.

sudo apt install -y psmisc lsof tree sqlite3
curl -o- 
https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
source ~/.nvm/nvm.sh
nvm install node
nvm use node
nvm alias default node
nvm use default
npm install
npm audit fix

npm test
npm run linter
clear