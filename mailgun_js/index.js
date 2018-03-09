#!/usr/bin/env node

function die(error_message, e=-1){
    console.error(error_message);
    process.exit(e)
}

function shutdown(e=0){
  process.exit(e)
}

var domain=process.env.MAILGUN_SEND_DOMAIN;
var api_key=process.env.MAILGUN_API_KEY;

if(!domain || !api_key){
    die("Env variables don't have exported api key and domain name");
}

const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'from', alias: 'f', type: String },
  { name: 'to', alias: 't', type: String },
  { name: 'message', alias: 'm', type: String },
  { name: 'subject', alias: 's', type: String },
  { name: 'exit_on_empty_message', alias: 'e', type: String },
]

const options = commandLineArgs(optionDefinitions)

var from_email=options.from 
                || process.env.MAILGUN_DEFAULT_FROM 
                || "Emailer"

var to_email=options.to 
                || process.env.MAILGUN_DEFAULT_TO

if(!to_email)
    die("No destination email specified")

var message=options.message
if(!message){
  if(options.exit_on_empty_message){
    shutdown()
  }else{
    die("No message specified")
  }
}

var subject=options.subject
                || "Emailer notification"

var mailgun = require('mailgun-js')({
    apiKey: api_key, 
    domain: domain
});
 
var data = {
  from: from_email+' <notification@'+domain+'>',
  to: to_email,
  subject: subject,
  text: message
};
 
mailgun.messages().send(data, function (error, body) {
  if(!error){
    console.log("Done.")
  }else{
    console.error(error)
  }
});
