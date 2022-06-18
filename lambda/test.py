from mailjet_rest import Client
import os
api_key = 'a0bc3ff2596664153ed4c152d6542d81'
api_secret = 'ce0f7d274b79ab9e1f25340d09dede10'
mailjet = Client(auth=(api_key, api_secret), version='v3.1')
data = {
  'Messages': [
    {
      "From": {
        "Email": "nabilbaugher@gmail.com",
        "Name": "Nabil"
      },
      "To": [
        {
          "Email": "nabilbaugher@gmail.com",
          "Name": "Nabil"
        }
      ],
      "Subject": "Greetings from Mailjet.",
      "TextPart": "My first Mailjet email",
      "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
      "CustomID": "AppGettingStartedTest"
    }
  ]
}
result = mailjet.send.create(data=data)
print(result.status_code)
print(result.json())