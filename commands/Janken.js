import BaseCommand from '../../../structures/commands/BaseCommand.js'

export default class Janken extends BaseCommand {
  /**
   * @param {string} category
   * @param {Array<*>} args
   */
  constructor(category, ...args) {
    super(...args)

    this.register(Janken, {
      category: category,

      name: 'janken',
      aliases: ['rps'],
      description: 'Play rock paper scissors against Soft & Wet',
      usage: 'janken <hand>',
      params: [
        {
          name: 'hand',
          description: 'rock/paper/scissors',
          type: 'string',
          required: true
        }
      ],
      example: 'janken rock'
    })
  }

  /**
   * @param {string} command string representing what triggered the command
   */
  run(command) {
    const emojis = ['✊', '✋', '✌']
    const hands = ['rock', 'paper', 'scissors']
    const results = [
      [0, -1, 1],
      [1, 0, -1],
      [-1, 1, 0]
    ]

    if (
      !hands.includes(this.args[0]) &&
      !hands.map((x) => x[0]).includes(this.args[0])
    ) {
      const embed = new this.Discord.MessageEmbed()
        .setTitle('Invalid usage of Janken')
        .setDescription('Use `rock/paper/scissors` or shorter `r/p/s`.')
        .setColor(this._m.config.colors.error)

      this.send(embed)
      return true
    }

    const botResponse = Math.round(Math.random() * (emojis.length - 1))
    const userResponse = hands.map((x) => x[0]).indexOf(this.args[0][0])

    const items = [
      'https://i.imgur.com/BEZQEfC.gif',
      'https://i.imgur.com/6oe9ulr.png',
      'https://i.imgur.com/KyDLGet.png',
      'https://i.imgur.com/XXoipxP.png'
    ]
    const item = items[(Math.random() * items.length) | 0]

    const embed = new this.Discord.MessageEmbed()

    let color = this._m.config.colors.warn
    let status = '👔 __Tie!__ 👔'

    switch (results[userResponse][botResponse]) {
      case -1:
        color = this._m.config.colors.error
        status = '❌ __You lose!__ ❌'
        break
      case 1:
        color = this._m.config.colors.success
        status = '✅ __You win!__ ✅'
    }

    embed
      .setColor(color)
      .setAuthor('JANKEN')
      .setTitle(status)
      .setImage(item)
      .setDescription(
        `**${this.user}: ${emojis[userResponse]} - ${emojis[botResponse]} :Soft & Wet**`
      )

    this.send(embed)

    return true
  }
}
