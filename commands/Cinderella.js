import BaseCommand from '../../../structures/commands/BaseCommand.js'

/**
 * @category Commands
 * @extends BaseCommand
 */
export default class Cinderella extends BaseCommand {
  /**
   * @param {string} category
   * @param {Array<*>} args
   */
  constructor(category, ...args) {
    super(...args)

    this.register(Cinderella, {
      category: category,
      guild_only: true,

      name: 'cinderella',
      aliases: ['avatar'],
      description: 'Sends the avatar of the provided user(s)',
      usage: 'cinderella [@ Mentioned Users]',
      params: [
        {
          name: 'users',
          description: 'The users you want the avatar of.',
          type: 'mention',
          allow_sentence: true,
          default: 'Returns your avatar'
        }
      ],
      example: 'cinderella @Yimura#6969 @GeopJr#4066'
    })
  }

  /**
   * @param {string} command string representing what triggered the command
   */
  async run(command) {
    const avatars = new Set()
    const uniqArgs = [...new Set(this.args)]

    if (uniqArgs.length === 0) {
      avatars.add({
        user: this.user.tag,
        avi: this.user.displayAvatarURL({
          format: 'png',
          size: 1024,
          dynamic: true
        })
      })
    }
    let max = 5 // avoid rate limit
    for (let i = 0; i < uniqArgs.length; i++) {
      const id = /<@!?(\d+)>/.exec(uniqArgs[i])
      const user = this.msgObj.client.users.cache.get(id ? id[1] : uniqArgs[i])
      if (!user) continue
      avatars.add({
        user: user.tag,
        avi: user.displayAvatarURL({
          format: 'png',
          size: 1024,
          dynamic: true
        })
      })
      max--
      if (max <= 0) break
    }

    const avatarArr = [...avatars]
    // if they provided an avatar
    if (avatarArr.length === 0 && uniqArgs.length !== 0) {
      const embed = new this.Discord.MessageEmbed()
        .setColor(this._m.config.colors.error)
        .setTitle("Couldn't get the avatars of any of the provided users")

      this.send(embed)
      return true
    }

    const items = [
      'https://i.imgur.com/YTpqAXc.gif',
      'https://i.imgur.com/Aa7S2jx.gif'
    ]
    const item = items[(Math.random() * items.length) | 0]
    const footerIcon = this.user.displayAvatarURL({ dynamic: true, size: 64 })

    for (let i = 0; i < avatarArr.length; i++) {
      const embed = new this.Discord.MessageEmbed()
        .setColor(this.randomEmbedColor)
        .setAuthor(
          `${avatarArr[i].user}'s avatar`,
          avatarArr[i].avi.replace('size=1024', 'size=64')
        )
        .setImage(avatarArr[i].avi)
        .setFooter(`Requested by: ${this.user.tag}`, footerIcon)

      if (i === 0) embed.setTitle('CINDERELLA').setThumbnail(item)
      this.send(embed)
    }

    return true
  }
}
