import BaseCommand from '../../../structures/commands/BaseCommand.js'
import Hermitpurple from 'hermitpurple'
const Wikia = new Hermitpurple.default("jojo", 5); // eslint-disable-line
const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'] // max 5 results

export default class Wiki extends BaseCommand {
  /**
   * @param {string} category
   * @param {Array<*>} args
   */
  constructor(category, ...args) {
    super(...args)

    this.register(Wiki, {
      category: category,

      name: 'wiki',
      aliases: ['wikia', 'find'],
      description: 'Search the jojo wiki for something',
      usage: 'wiki <term>',
      params: [
        {
          name: 'term',
          description: 'The term to be searched',
          type: 'string',
          is_sentence: true,
          required: true
        }
      ],
      example: 'wiki Soft & Wet'
    })
  }

  /**
   * @param {string} command string representing what triggered the command
   */
  async run(command) {
    if (this.args.length === 0) {
      const embed = new this.Discord.MessageEmbed()
        .setTitle('Please provide a search term.')
        .setColor(this._m.config.colors.error)
      this.send(embed)
      return true
    }
    try {
      const results = await Wikia.searchResults(
        this.args.join(' ').toLowerCase()
      )
      let selected = 0
      if (results.length > 1) {
        const searchEmbedDescription = results
          .map((x, y) => emojis[y] + '. ' + x.title)
          .join('\n')
        const embedSearch = new this.Discord.MessageEmbed()
          .setColor(this._m.config.colors.custom.yellow)
          .setTitle('Select your article:')
          .setDescription(
            searchEmbedDescription +
            '\n\nReply with the number of the article you want to fetch.'
          )
        const searchMsg = await this.send(embedSearch)

        const filter = (m) => m.author.id === this.user.id
        const response = await this.textChannel
          .awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ['time']
          })
          .catch((collected) => null)
        await searchMsg.delete()
        if (response === null) {
          const embedTimedOut = new this.Discord.MessageEmbed()
            .setColor(this._m.config.colors.error)
            .setTitle('Took too long to reply.')
          await this.send(embedTimedOut)
          return false
        } else if (
          isNaN(response.first().content) ||
          response.first().content % 1 !== 0 ||
          response.first().content > results.length ||
          response.first().content < 1
        ) {
          const embedTimedOut = new this.Discord.MessageEmbed()
            .setColor(this._m.config.colors.error)
            .setTitle('Provided number is invalid.')
          await this.send(embedTimedOut)
          return false
        } else {
          selected = parseInt(response.first().content, 10) - 1 // arrays start at 0
        }
        response.first().delete().catch(null)
      }

      const article = await Wikia.getArticle(results[selected])
      const description =
        article.article.length > 1800
          ? article.article.substring(0, 1800 - 3) + '...'
          : article.article
      const embed = new this.Discord.MessageEmbed()
        .setColor(this.randomEmbedColor)
        .setTitle(article.title)
        .setURL(article.url)
        .setImage(article.img)
        .setDescription(description)
      this.send(embed)
    } catch (e) {
      const embed = new this.Discord.MessageEmbed()
        .setColor(this._m.config.colors.error)
        .setTitle('Nothing found for:')
        .setDescription(this.args.join(' '))
      this.send(embed)
    }

    return true
  }
}
