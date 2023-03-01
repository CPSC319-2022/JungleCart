#!/bin/zsh
rm -rf cdk.out/.cache cdk.out/* dist/* 
npm run build      
npm run deploy ApiStack UsersStack LayersStack  