#!/usr/bin/python3

import smtplib
from email.message import EmailMessage
import os
import argparse

def load_recipients_from_file(file_name):
    emails=[]
    with open(file_name) as f:
        content = f.readlines()
        emails = [x.strip() for x in content]
    return emails 

def read_env(name):
    if name in os.environ:
        return os.environ[name]
    else:
        print("Environment variable \"%s\" not specified" %name)
        exit(1)

parser = argparse.ArgumentParser(description='Send email notification to users')
parser.add_argument('--recipients', '-r', metavar='recipients', required=True,
                   help='File that contains list of recipients in every line')
parser.add_argument('--subject', '-s', metavar='subject', required=True,
                   help='Message subject text')
parser.add_argument('--body', '-b', metavar='message_body', required=True,
                   help='Body of the message')

args = parser.parse_args()

recipients=load_recipients_from_file(args.recipients)

# Read environment variables
mail_from = read_env("EMAIL_FROM")
mail_pass = read_env("EMAIL_PASSWORD")
smtp_server = read_env("EMAIL_SMTP_HOST")
smtp_port = read_env("EMAIL_SMTP_PORT")

msg = EmailMessage()
msg.set_content(args.body)
msg['Subject'] = args.subject
msg['From'] = mail_from
msg['To'] = recipients

try:  
    server = smtplib.SMTP_SSL(smtp_server, int(smtp_port))
    server.ehlo()
    server.login(mail_from, mail_pass)
    server.send_message(msg)
    server.close()

    print('Email notification sent')
except:  
    print('Error sending email...')
