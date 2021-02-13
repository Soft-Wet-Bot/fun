import BaseCommand from '../../../structures/commands/BaseCommand.js'

export default class HermitPurple extends BaseCommand {
  /**
   * @param {string} category
   * @param {Array<*>} args
   */
  constructor(category, ...args) {
    super(...args)

    this.register(HermitPurple, {
      category: category,
      guild_only: true,

      name: 'hermit purple',
      aliases: [],
      description: 'Info about mentioned user',
      usage: 'hermit purple [@ Mentioned User]',
      params: [
        {
          name: 'user',
          description: 'The user from which you want more information.',
          type: 'mention',
          default: 'Shows info about your own user'
        }
      ],
      example: 'hermit purple @Yimura#6969'
    })
  }

  /**
   * @param {string} command string representing what triggered the command
   */
  async run(command) {
    const member =
      this.msgObj.mentions.members.first() ||
      this.msgObj.guild.members.cache.get(this.args[0]) ||
      this.serverMember
    if (!member) {
      const embed = new this.Discord.MessageEmbed()
        .setTitle(
          'Unknown error occured while trying to get a mentioned user...'
        )
        .setColor(this._m.config.colors.error)
      this.send(embed)

      return true
    }

    const items = [
      'https://i.imgur.com/QcJexGH.gif',
      'https://i.imgur.com/Gpq9N8G.gif',
      'https://i.imgur.com/EDytVyF.gif'
    ]
    const item = items[(Math.random() * items.length) | 0]
    const bot = member.user.bot ? '✅' : '❌'
    const creationDate = member.user.createdAt
    const joinDate = member.joinedAt
    const embed = new this.Discord.MessageEmbed()
      .setColor(this.randomEmbedColor)
      .setTitle('HERMIT PURPLE')
      .setThumbnail(
        `${member.user.displayAvatarURL({ dynamic: true, size: 1024 })}`
      )
      .setImage(item)
      .setAuthor(
        `${member.user.username}#${member.user.discriminator}`,
        member.user.displayAvatarURL({ dynamic: true, size: 1024 })
      )
      .addField('🔢 ID', member.user.id, true)
      .addField(
        '👨 Avatar',
        `[Here](${member.user.displayAvatarURL({
          format: 'png',
          size: 1024,
          dynamic: true
        })})`,
        true
      )
      .addField('🤖 Bot', `${bot}`, true)
      .addField('👮 Roles', `${member.roles.cache.length}`, true)
      .addField(
        '🍰 Creation Date',
        `${creationDate.getDate()}/${creationDate.getMonth() + 1
        }/${creationDate.getFullYear()}`,
        true
      )
      .addField(
        '🏃 Join Date',
        `${joinDate.getDate()}/${joinDate.getMonth() + 1
        }/${joinDate.getFullYear()}`,
        true
      )
    this.send(embed)

    return true
  }
}
