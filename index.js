const Aria2 = require('aria2')
const Parser = require('rss-parser')
const fetch = require('node-fetch')
const webhook = require("webhook-discord")
const hook = new webhook.Webhook("https://discord.com/api/webhooks/988105633960189952/199JHTbumYbJx4RA03BkMmNgjdZUFkfIMSRC_sg1MGs6bQGdz0E43cevSkXstxZa7rvr")
const config = require('./config')

const parser = new Parser()

const {
  feed_link,
  rule_list = [/.*/],
  interval = 60 * 1000,
  first_dl_enable = false,
  aria2_config,
  aria2_dl_dir,
  tg_token,
  tg_chat_id,
} = config

const downloaded_list = []
let run_count = 0
let _lastBuildDate

const sendToAria2 = async (uri) => {
  const options = aria2_dl_dir ? { dir: aria2_dl_dir } : {}
  const [guid] = await new Aria2(aria2_config).call('addUri', [uri], options)
  // console.log('guid:', guid, 'uri:', uri)
}

const sendMessage = async (text) => {
  if (!tg_token && !tg_chat_id) return
  const res = await fetch(`https://api.telegram.org/bot${tg_token}/sendMessage?${new URLSearchParams({
    chat_id: tg_chat_id,
    text: text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  })}`)
  console.log('sendMessage Status:', await res.status)
}

function sendDiscordWebhook(title, link) {
  const embed = new webhook.MessageBuilder()
        .setName("Anime Downloader")
        .setTitle('↓ ' + title)
        .setAuthor('Anime Downloader', 'https://cdn.discordapp.com/icons/572277588102348800/dcab0212f4f760a2e8b474e1ceead822.png?size=4096')
        .setDescription("**" + title.substring(13, title.length - 23) + "** is out <@572277409395638274>!\nDownload started.")
        .addField('Torrent Link', link, true)
        .setColor('#58b9ff')
        .setFooter('Added By System', 'https://cdn.discordapp.com/avatars/572277409395638274/478518e76f40efc42ec8140640d13670.png?size=4096')
        // .setTimestamp();
  hook.send(embed);
}

const checkTitleMatch = (title) => {
  for (const rule of rule_list) {
    const regex = rule
    const out = regex.test(title)
    if (out) return out
  }
  return false
}

const run = async () => {
  run_count++

  const feed = await parser.parseURL(feed_link)
  const { title, items } = feed
  const lastBuildDate = feed.lastBuildDate || feed.pubDate || feed.items[0].pubDate || ''

  if (lastBuildDate === '') {
    console.log('time not detected, skip time check')
  } else {
    if (lastBuildDate === _lastBuildDate) {
      return
    }
    _lastBuildDate = lastBuildDate
  }

  for (const item of items) {
    const { title } = item
    const link = (item.enclosure && item.enclosure.url) || item.link || ''
    if (link === '') {
      console.log('no download links detected, rss feed inaccessible')
      return
    }
    if (!first_dl_enable && run_count === 1) {
      downloaded_list.push(link)
      } else {
      !downloaded_list.includes(link) && checkTitleMatch(title) && downloaded_list.push(link) && (() => {
        console.log('↓', title)
        sendToAria2(link)
        sendDiscordWebhook(title, link)
      })()
    }
  }
}

(async () => {
  if (!feed_link || !aria2_config) {
    console.log('missing configuration')
    return
  }
  try {
    await run()
    setInterval(run, interval)
  } catch (e) {
    console.error(e)
  }
})()