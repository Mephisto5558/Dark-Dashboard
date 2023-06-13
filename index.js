const fetch = require('node-fetch');
const fs = require('fs');
module.exports = (themeConfig = {}) => {
    console.log(`
██████ ██████ ██████ ██████ ██████ ██████ ██████ ██████ ██████ ██████ ██████
IMPORTNAT,
please keep in mind that this is a simple fix for the dark DBD theme that's
currently deprecated and might not work as expected at all times.
use dbd-soft-ui Theme instead: 
https://www.npmjs.com/package/dbd-soft-ui
██████ ██████ ██████ ██████ ██████ ██████ ██████ ██████ ██████ ██████ ██████
`)

    if ((Number(((require("discord-dashboard").version).slice(0, 3)))) < 2.3) throw new TypeError("This theme supports only discord-dashboard@>2.3 # Please update your discord-dashboard module.");

    return {
        themeCodename: 'dbddrk',
        viewsPath: require('path').join(__dirname, '/views'),
        staticPath: require('path').join(__dirname, '/views/src'),
        themeConfig: themeConfig,
        embedBuilderComponent: (require('fs').readFileSync(require('path').join(__dirname, '/embedBuilderComponent.txt'), 'utf8')).replace('{{Colour}}', themeConfig.colourUpperCase ? themeConfig.colourUpperCase : 'Colour').replace('{{colour}}', themeConfig.colourLowerCase ? themeConfig.colourLowerCase : 'colour'),
        init: (app, config) => {
            app.use('/commands', (req, res) => {
                res.render('commands', {req: req, config: config, themeConfig: themeConfig});
            });
            app.use('/privacy-policy', (req, res) => {
                res.render('pp', {req: req, config: config, themeConfig: themeConfig});
            });
            app.use('/debug', async (req, res) => {
                /*
                If you are modifying the theme, please do not remove this page.
                It will be used with support in the discord server.
                */

                let onlineFiles = {
                    index: await fetch(`https://raw.githubusercontent.com/Mephisto5558/Dark-Dashboard/main/src/ejs/index.ejs`),
                    guild: await fetch(`https://raw.githubusercontent.com/Mephisto5558/Dark-Dashboard/main/src/ejs/guild.ejs`),
                    guilds: await fetch(`https://raw.githubusercontent.com/Mephisto5558/Dark-Dashboard/main/src/ejs/guilds.ejs`)
                }

                onlineFiles.index = await onlineFiles.index.text();
                onlineFiles.guild = await onlineFiles.guild.text();
                onlineFiles.guilds = await onlineFiles.guilds.text();

                let localFiles = {
                    index: await fs.readFileSync(__dirname + '/views/index.ejs', 'utf-8'),
                    guild: await fs.readFileSync(__dirname + '/views/guild.ejs', 'utf-8'),
                    guilds: await fs.readFileSync(__dirname + '/views/guilds.ejs', 'utf-8')
                }


                res.render('debug', {
                    bot: config.bot,
                    req,
                    config,
                    rawUptime: process.uptime(),
                    onlineFiles,
                    localFiles,
                    nodeVersion: process.version,
                    themeConfig: themeConfig,
                    discordVersion: require('discord.js').version,
                    dbdVersion: require('discord-dashboard').version,
                    themeVersion: require('./package.json').version
                });
            });
        }
    };
};
