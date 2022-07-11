# RSS to Aria2
This script will continiously check the rss feed that you provide on config  
and check for matches on your regex, and download them if they match.

## Branches
[Main Branch](https://github.com/JadenJSJ/rss-to-aria2) - No extra features  
[discordEmbed Branch](https://github.com/JadenJSJ/rss-to-aria2/tree/discordEmbed) - Discord Webhook Support  
[discordEmbed-Anilist](https://github.com/JadenJSJ/rss-to-aria2/tree/discordEmbed-Anilist) - Discord Webook with Anilist Integration

## Usage

```bash
git clone https://github.com/JadenJSJ/rss-to-aria2.git
cd rss-to-aria2

cp config_example.js config.js
nano config.js

npm i
npm start
```

If you don't have a aria2c rpc server already running
```bash
nano startaria2c.sh
sh startaria2c
```
