const Imap = require('imap');
const { simpleParser } = require('mailparser');
const fs = require('fs');

// IMAP configuration
const imap = new Imap({
  user: 'your-email@example.com', // Replace with your email
  password: 'your-password', // Replace with your password
  host: 'imap.example.com', // Replace with your IMAP host
  port: 993,
  tls: true
});

function extractPrices(emailBody) {
  const prices = {
    HVO: null,
    PREMIUM_DIESEL: null,
    PREMIUM_GASOLINE: null,
    GASOLINE: null,
    DIESEL: null,
  };

  // Your regex or parsing logic here to extract prices
  const priceLines = emailBody.split('\n');
  priceLines.forEach(line => {
    const details = line.split(':');
    if (details[0] && prices.hasOwnProperty(details[0].trim())) {
      prices[details[0].trim()] = details[1] ? parseFloat(details[1]) : null;
    }
  });

  return prices;
}

function updatePrices(prices) {
  const data = JSON.parse(fs.readFileSync('prices.json', 'utf8'));
  
  // Update prices
  for (const key in prices) {
    if (prices[key] !== null) {
      data[key] = prices[key];
    }
  }

  fs.writeFileSync('prices.json', JSON.stringify(data, null, 2));
}

imap.once('ready', function() {
  imap.openBox('INBOX', true, function(err, box) {
    if (err) throw err;

    imap.search(['UNSEEN'], function(err, results) {
      if (err) throw err;

      const f = imap.fetch(results, { bodies: '' });
      f.on('message', function(msg) {
        msg.on('body', function(stream) {
          simpleParser(stream, (err, email) => {
            if (err) throw err;

            const prices = extractPrices(email.text);
            updatePrices(prices);
          });
        });
      });

      f.on('end', function() {
        console.log('Done fetching all messages!');
        imap.end();
      });
    });
  });
});

imap.connect();