import requests
from bs4 import BeautifulSoup
from mailjet_rest import Client
import json
import os
from dotenv import load_dotenv

# for dependencies: https://docs.aws.amazon.com/lambda/latest/dg/python-package.html
# user: id, timestamp, email, prefs
# prefs: intern, new grad, or both

def lambda_handler(event=None, context=None):    
    # fetch old postings from database
    intern_db_postings = get_postings_from_db(is_intern=True)
    new_grad_db_postings = get_postings_from_db(is_intern=False)
    
    # fetch all postings from web
    intern_web_postings = get_postings_from_web(is_intern=True)
    new_grad_web_postings = get_postings_from_web(is_intern=False)
    
    # calculate which postings are new
    new_intern_postings = get_new_postings(intern_db_postings, intern_web_postings)
    new_new_grad_postings = get_new_postings(new_grad_db_postings, new_grad_web_postings)
    
    new_intern_postings_exist = new_intern_postings is not None and len(new_intern_postings) != 0
    new_new_grad_postings_exist = new_new_grad_postings is not None and len(new_new_grad_postings) != 0
    
    if new_intern_postings_exist and new_new_grad_postings_exist:
        all_recipients = get_all_recipients_from_db()
        intern_recipients = filter_recipients(all_recipients, is_intern=True)
        new_grad_recipients = filter_recipients(all_recipients, is_intern=False)
    elif new_intern_postings_exist:
        intern_recipients = get_recipients_from_db_by_is_intern(is_intern=True)
    else:
        new_grad_recipients = get_recipients_from_db_by_is_intern(is_intern=False)

    # send out new intern postings if there are any
    if new_intern_postings_exist:
        intern_table = build_email_html(new_intern_postings)
        email_title = build_email_title(new_intern_postings)
        send_mail(intern_recipients, intern_table, email_title)
        update_db_postings(new_intern_postings, is_intern=False)
    else:
        print('No new intern postings!')
        
    # send out new new grad postings if there are any
    if new_new_grad_postings_exist:
        new_grad_table = build_email_html(new_new_grad_postings)
        email_title = build_email_title(new_new_grad_postings)
        send_mail(new_grad_recipients, new_grad_table, email_title)
        update_db_postings(new_new_grad_postings, is_intern=False)
    else:
        print('No new new grad postings!')

    return {
        'statusCode': 200,
        'body': json.dumps('Postings sent!')
    }
    
def get_all_recipients_from_db():
    GET_URL = 'https://internship-tracker-production.up.railway.app/users/'
    
    response = requests.get(GET_URL)
    if not response.ok:
        print('Error fetching all recipients:', response.status_code)
        
    data = response.json()
    print(data)
    return data
    
def get_recipients_from_db_by_is_intern(is_intern):
    GET_URL = 'https://internship-tracker-production.up.railway.app/users/'
    GET_URL += 'intern' if is_intern else 'newgrad'

    response = requests.get(GET_URL)
    if not response.ok:
        target_group = 'intern' if is_intern else 'new grad'
        print('Error fetching', target_group, 'recipients:', response.status_code)
        
    data = response.json()
    print(data)
    return data

def filter_recipients(recipients, is_intern):
    result = []
    for recipient in recipients:
        if recipient['preferenceList'] == 'BOTH':
            result.append(recipient)
        elif recipient['preferenceList'] == 'INTERN' and is_intern:
            result.append(recipient)
        elif recipient['preferenceList'] == 'NEWGRAD' and not is_intern:
            result.append(recipient)
    return result

def get_postings_from_db(is_intern):
    GET_URL = 'https://internship-tracker-production.up.railway.app/postings/'
    
    response = requests.get(GET_URL)
    if not response.ok:
        print('Error fetching postings from database:', response.status_code)
        return None
    
    data = response.json()
    if is_intern:
        return data['InternPosts']
    else:
        return data['NewGradPosts']

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
        try:
            url = cols[0].find('a')['href']
        except: # no url --> posting closed
            continue
        cols_text.insert(1, url)
        data.append(cols_text)
    
    # transform data to json style
    result = []

    for posting in data:
        json_posting = {
            'company': posting[0],
            'url': posting[1],
            'location': posting[2],
            'notes': posting[3],
            'isIntern': is_intern,
        }
        result.append(json_posting)

    return result

def get_new_postings(db_postings_data, web_postings_data):
    # key: email, value: json posting
    db_map = {posting['url'] : posting for posting in db_postings_data}
    web_map = {posting['url'] : posting for posting in web_postings_data}
    
    # calculate set difference to get new emails
    new_urls = set(web_map.keys()).difference(set(db_map.keys()))
    
    result = []
    for url in new_urls:
        result.append(web_map[url])
    return result

def update_db_postings(new_postings, is_intern):
    POST_URL = 'https://internship-tracker-production.up.railway.app/postings/'
    response = requests.post(POST_URL, json=new_postings)
    print('Attempting to update database with new '+ ('intern ' if is_intern else 'new grad ') +'postings...')
    print(response)

    
def build_email_html(postings):
    table = '<table><thead><tr><th>Name</th><th>Location</th><th>Notes</th></tr></thead><tbody>'
    for posting in postings:
        row = '<tr>'
        row += '<td><a href='+posting['url']+' rel="nofollow">'+posting['company']+'</a></td>'
        row += '<td>'+posting['location']+'</td>'
        row += '<td>'+posting['notes']+'</td>'
        row += '</tr>'
        table += row
    table += '</tbody></table>'
    return table

def build_email_title(postings):
    if len(postings) == 1:
        return 'New job posting from ' + postings[0]['company'] + '!'
    
    company_names = [posting['company'] for posting in postings]
    if len(postings) == 2:
        company_names_str = company_names[0] + ' and ' + company_names[1]
    elif len(postings) == 3:
        company_names_str = ', '.join(company_names[:-1]) + ', and ' + company_names[-1] 
    else:
        company_names_str = ', '.join(company_names[:3]) + ', and more'
    return 'New job postings from ' + company_names_str + '!'

def send_mail(recipients, email_html, email_title):
    # setup
    FROM_EMAIL = 'nabilb@mit.edu'
    load_dotenv()
    mailjet = Client(auth=(os.getenv("MAILJET_API_KEY"), os.getenv("MAILJET_API_SECRET_KEY")), version='v3.1')
    
    if recipients is None:
        print('no recipients')
        return
    
    # send data
    for recipient in recipients:
        email_html += '<p><a href="https://intern-tracker.netlify.app/unsubscribe/'+recipient['id']+'">unsubscribe</a></p>'
        errors = [] 
        data = {
            'Messages': [
                {
                    "From": {
                        "Email": FROM_EMAIL,
                        "Name": "AppTrack"
                    },
                    "To": [
                        {
                            "Email": recipient['emailAddress'],
                        }
                    ],
                    "Subject": email_title,
                    "TextPart": "Table with postings.",
                    "HTMLPart": email_html,
                    "CustomID": "pittcscScraper"
                }
            ]
        }
        result = mailjet.send.create(data=data)
        print('email message status:', result.status_code)
        print(result.json())
        if int(result.status_code) != 200:
            errors.append((result.status_code, recipient['email']))