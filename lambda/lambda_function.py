import requests
from bs4 import BeautifulSoup
from mailjet_rest import Client
import json
import os
from dotenv import load_dotenv

# for dependencies: https://docs.aws.amazon.com/lambda/latest/dg/python-package.html

def lambda_handler(event, context):    
    PITTCSC_INTERNSHIP_URL = "https://github.com/pittcsc/Summer2023-Internships"
    page = requests.get(PITTCSC_INTERNSHIP_URL)
    
    data = []
    soup = BeautifulSoup(page.content, "html.parser")
    table = soup.find('table')
    table_body = table.find('tbody')
    rows = table_body.find_all('tr')

    for row in rows:
        cols = row.find_all('td')
        cols = [ele.text.strip() for ele in cols]
        data.append(cols)

    # columns: Name, Locations, Notes
    # for internship in data:
    #     print('Name:', internship[0])
    #     print('Location:', internship[1])
    #     print('Notes:', internship[2])
    #     print('')
    
    load_dotenv()
    print(os.getenv("MAILJET_API_KEY"))
    mailjet = Client(auth=(os.getenv("MAILJET_API_KEY"), os.getenv("MAILJET_API_SECRET_KEY")), version='v3.1')
    data = {
        'Messages': [
            {
            "From": {
                "Email": "nabilb@mit.edu",
                "Name": "Internship Tracker"
            },
            "To": [
                {
                "Email": "nabilbaugher@gmail.com",
                "Name": "Nabil"
                }
            ],
            "Subject": "PittCSC Internship Postings!",
            "TextPart": "My first Mailjet email",
            "HTMLPart": str(table),
            "CustomID": "testScraper"
            }
        ]
    }
    result = mailjet.send.create(data=data)
    print(result.status_code)
    print(result.json())
        
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }