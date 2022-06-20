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
    # fetch old postings from database
    intern_db_postings_data = json.loads(get_postings_from_db(is_intern=True))
    new_grad_db_postings_data = json.loads(get_postings_from_db(is_intern=False))
    
    # fetch all postings from web
    intern_web_postings_data = get_postings_from_web(is_intern=True)
    new_grad_web_postings_data = get_postings_from_web(is_intern=False)
    
    # calculate which postings are new
    new_intern_postings = get_new_postings(intern_db_postings_data, intern_web_postings_data)
    new_new_grad_postings = get_new_postings(new_grad_db_postings_data, new_grad_web_postings_data)
    
    # send out new intern postings if there are any
    if len(new_intern_postings) != 0:
        intern_recipients = json.loads(get_recipients_from_db(is_intern=True))
        intern_table = postings_to_table(new_intern_postings)
        send_mail(intern_recipients, intern_table)
        update_db_postings(new_intern_postings, is_intern=False)
    
    # send out new intern postings if there are any
    if len(new_new_grad_postings) != 0:
        new_grad_recipients = json.loads(get_recipients_from_db(is_intern=False))
        new_grad_table = postings_to_table(new_new_grad_postings)
        send_mail(new_grad_recipients, new_grad_table)
        update_db_postings(new_new_grad_postings, is_intern=False)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Postings sent!')
    }
    
def get_recipients_from_db(is_intern):
    GET_URL = '' if is_intern else ''
    result = {
        'recipients': [
            {
                'id': 'sampleid',
                'time_created': 'sampletime',
                'email': 'nabilbaugher@gmail.com',
                'prefs': 'BOTH',
            },
        ]
    } 
    return json.dumps(result)

def get_postings_from_db(is_intern):
    GET_URL = '' if is_intern else ''
    if is_intern:
        return json.dumps({'postings': []})
    # new grad test
    result = {
        'postings': [
            {
                'name': 'Akuna Capital',
                'url': 'https://akunacapital.com/careers?experience=junior&department=development#careers',
                'location': 'Chicago',
                'notes': 'Various Junior Developer Positions',
            },
            {
                'name': 'VMware',
                'url': 'https://careers.vmware.com/main/jobs/R2212905?lang=en-us',
                'location': 'Palo Alto, California; Atlanta, Georgia',
                'notes': 'Launch New Grad SWE',
            },
        ]
    } 
    return json.dumps(result)

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
        cols_text = [ele.text.strip() for ele in cols]
        url = cols[0].find('a')['href']
        cols_text.insert(1, url)
        data.append(cols_text)
    
    # transform data to json style
    result = []

    for posting in data:
        json_posting = {
            'name': posting[0],
            'url': posting[1],
            'location': posting[2],
            'notes': posting[3],
            'isIntern': is_intern,
        }
        result.append(json_posting)
        
    return result

def get_new_postings(db_postings_data, web_postings_data):
    # print(type(db_postings), db_postings)
    # key: email, value: json posting
    db_map = {posting['url'] : posting for posting in db_postings_data['postings']}
    web_map = {posting['url'] : posting for posting in web_postings_data}
    
    # calculate set difference to get new emails
    new_urls = set(web_map.keys()).difference(set(db_map.keys()))
    
    result = []
    for url in new_urls:
        result.append(web_map[url])
    return result

def update_db_postings(new_postings, is_intern):
    POST_URL = 'http://localhost:8080/postings/'
    response = requests.post(POST_URL, json=new_postings)
    print('Attempting to update database with new '+ ('intern ' if is_intern else 'new grad ') +'postings...')
    print(response)

    
def postings_to_table(postings):
    table = '<table><thead><tr><th>Name</th><th>Location</th><th>Notes</th></tr></thead><tbody>'
    for posting in postings:
        row = '<tr>'
        row += '<td><a href='+posting['url']+' rel="nofollow">'+posting['name']+'</a></td>'
        row += '<td>'+posting['location']+'</td>'
        row += '<td>'+posting['notes']+'</td>'
        row += '</tr>'
        table += row
    table += '</tbody></table>'
    return table

def send_mail(recipients_data, table_str):
    # setup
    FROM_EMAIL = 'nabilb@mit.edu'
    load_dotenv()
    mailjet = Client(auth=(os.getenv("MAILJET_API_KEY"), os.getenv("MAILJET_API_SECRET_KEY")), version='v3.1')
    
    # send data
    for recipient in recipients_data['recipients']:
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
                            "Email": recipient['email'],
                        }
                    ],
                    "Subject": "PittCSC Summer 2023 Internship Postings!",
                    "TextPart": "Table with postings.",
                    "HTMLPart": table_str,
                    "CustomID": "pittcscScraper"
                }
            ]
        }
        result = mailjet.send.create(data=data)
        print(result.status_code)
        print(result.json())
        if int(result.status_code) != 200:
            errors.append((result.status_code, recipient['email']))