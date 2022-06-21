module.exports = {
  feed_link: 'https://subsplease.org/rss/?t&r=1080', 
  // RSS Feed link

  rule_list: [ /\[SubsPlease\] Spy x Family/g, /\[SubsPlease\] Kaguya-sama wa Kokurasetai S3/g, /\[SubsPlease\] Date a Live IV/g, /\[SubsPlease\] Paripi Koumei/g ], 
  // Regex

  interval: 60 * 1000, 
  // Interval is in microseconds

  first_dl_enable: false, 
  // false it will only download episodes that released after the app
  // true it will download any episodes that is found on the rss feed

  aria2_config: {
    host: 'localhost', // Aria2 RPC 主机名
    port: 6800, // 端口号
    secure: false,
    secret: '', // 密钥
    path: '/jsonrpc'
  },
  aria2_dl_dir: '',
  tg_token: '',
  tg_chat_id: '',
}