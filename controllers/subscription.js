const Email = require('../models/email')
const transporter = require('../util/mail')
const jwt = require('jsonwebtoken')
const qs = require('querystring')

exports.subscribeUser = (req, res, next) => {

  const email = req.body.email
 
  Email.findAll({
    where: {email: email}
  })
  .then(result => {
    if (result.length > 0) {
      return transporter.sendMail({
        from: process.env.GMAIL, 
        to: email, 
        subject: 'Subscription',
        text: 'You are already our member !'
      }, (err, data) => {
        if (err) {
          return console.log(err);
        }
        console.log('Email sent !');
        res.status(200).json({ message: 'Subscribtion sucessful !'});
      });
    }

    const token = jwt.sign(
      {
        email: email.toString()
      },
      'somesupersecretsecret',
      { expiresIn: '24h' }
    )
    const url = `http://localhost:3000/add/${token}`
    const mailOptions = {
      from: process.env.GMAIL, 
      to: email, 
      subject: 'Subscription',
      html: `Please click the link: <a href="${url}">${url}</a>`
    };
    return transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return console.log(err);
        }
        console.log('Email sent for confirmation !');
        res.status(200).json({ message: 'Subscribtion sucessful !'});
      });
    }
  )
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })
}


exports.addUser = (req, res, next) => {
  
  const token = req.params.token
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Bad token !');
    error.statusCode = 400;
    throw error;
  }  
  const email = decodedToken.email
  
  Email.findAll({
    where: {email: email}
  })
  .then(result => {
    if (result.length > 0) {
      return console.log('Email exists !')
    }
    return Email.create({
      email: email
    })
  })
  .then(() => {
    res.redirect('https://www.google.com/')
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })
}