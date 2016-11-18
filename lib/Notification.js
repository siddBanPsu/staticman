'use strict'

const config = require(__dirname + '/../config')

const Notification = function (mailAgent) {
  this.mailAgent = mailAgent
}

Notification.prototype._buildMessage = function (fields, options, siteConfig) {
  return `
  <html>
    <body>
      Dear human,<br>
      <br>
      Someone replied to a comment you subscribed to${siteConfig.get('name') ? ` on <strong>${siteConfig.get('name')}</strong>` : ''}.<br>
      <br>
      ${options.origin ? `<a href="${options.origin}">Click here</a> to see it.` : ''} If you do not wish to receive any further notifications for this thread, <a href="%mailing_list_unsubscribe_url%">click here</a>.<br>
      <br>
      With love,<br>
      -- <a href="https://staticman.net">Staticman</a>
    </body>
  </html>
  `
}

Notification.prototype.send = function (to, fields, options, siteConfig) {
  const subject = siteConfig.get('name') ? `New reply on "${siteConfig.get('name')}"` : 'New reply'

  this.mailAgent.messages().send({
    from: `Staticman <${config.get('email.fromAddress')}>`,
    to,
    subject,
    html: this._buildMessage(fields, options, siteConfig)
  }, (err, res) => {
    if (err) {
      console.log(err.stack || err)
    }
  })
}

module.exports = Notification