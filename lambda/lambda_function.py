import requests
from bs4 import BeautifulSoup
from mailjet_rest import Client
import json
import os
from dotenv import load_dotenv

# for dependencies: https://docs.aws.amazon.com/lambda/latest/dg/python-package.html
# user: id, timestamp, email, prefs
# prefs: intern, new grad, or both

def lambda_handler(event, context):
    # get intended recipients from database
    intern_recipients = get_recipients_from_db(is_intern=True)
    new_grad_recipients = get_recipients_from_db(is_intern=False)
    
    # fetch old postings from database
    intern_db_postings = get_postings_from_db(is_intern=True)
    new_grad_db_postings = get_postings_from_db(is_intern=False)
    
    # fetch postings from web
    intern_web_postings = get_postings_from_web(is_intern=True)
    new_grad_web_postings = get_postings_from_web(is_intern=False)
    print(new_grad_web_postings)
    
    # calculate which postings are new
    new_intern_postings = get_new_postings(intern_db_postings, intern_web_postings)
    new_new_grad_postings = get_new_postings(new_grad_db_postings, new_grad_web_postings)
    
    # # send out new intern postings if there are any
    # if len(new_intern_postings) != 0:
    #     send_mail(intern_recipients, new_intern_postings)
    
    # # send out new intern postings if there are any
    # if len(new_new_grad_postings) != 0:
    #     send_mail(new_grad_recipients, new_intern_postings)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Postings sent!')
    }
    
def get_recipients_from_db(is_intern):
    # TODO: implement
    return None

def get_postings_from_db(is_intern):
    # TODO: implement
    return None

def get_postings_from_web(is_intern):
    PITTCSC_INTERNSHIP_URL = 'https://github.com/pittcsc/Summer2023-Internships'
    CODERQUAD_NEW_GRAD_URL = 'https://github.com/coderQuad/New-Grad-Positions-2023'

    page = requests.get(PITTCSC_INTERNSHIP_URL if is_intern else CODERQUAD_NEW_GRAD_URL)
    
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
    return data

def get_new_postings():
    # TODO: implement
    return None

def send_mail(recipients, table):
    # setup
    FROM_EMAIL = 'nabilb@mit.edu'
    load_dotenv()
    mailjet = Client(auth=(os.getenv("MAILJET_API_KEY"), os.getenv("MAILJET_API_SECRET_KEY")), version='v3.1')
    
    # send data
    for name, email in recipients:
        errors = [] 
        data = {
            'Messages': [
                {
                "From": {
                    "Email": "nabilb@mit.edu",
                    "Name": "Internship Tracker"
                },
                "To": [
                    {
                    "Email": email,
                    "Name": name
                    }
                ],
                "Subject": "PittCSC Summer 2023 Internship Postings!",
                "TextPart": "Table with postings.",
                "HTMLPart": str(table),
                "CustomID": "pittcscScraper"
                }
            ]
        }
        result = mailjet.send.create(data=data)
        print(result.status_code)
        print(result.json())
        if int(result.status_code) != 200:
            errors.append
        return 