import requests
from bs4 import BeautifulSoup
from mailjet_rest import Client
import json
import os
from dotenv import load_dotenv
from enum import Enum

# to add dependencies: https://docs.aws.amazon.com/lambda/latest/dg/python-package.html
# user: id, timestamp, email, prefs
# prefs: intern, new grad, or both

USERS_URL = None
POSTINGS_URL = None


def make_global_urls():
    global USERS_URL, POSTINGS_URL
    load_dotenv()
    BASE_URL = os.getenv('URL')
    USERS_URL = BASE_URL + '/users/' + os.getenv('USERS_API_KEY')
    POSTINGS_URL = BASE_URL + '/postings'


class Users(Enum):
    BOTH = 0
    INTERN = 1
    NEW_GRAD = 2


def lambda_handler(event=None, context=None):
    result = 'Perhaps the API isn\'t running?'
    try:
        result = _lambda_handler_inner(event, context)
        return result
    except:
        print(result)
        print('Something went wrong, but I\'m not sure what...')
        return {"statusCode": 200}


def _lambda_handler_inner(event=None, context=None):
    make_global_urls()
    # fetch old postings from database
    intern_db_postings = get_postings_from_db(Users.INTERN)
    new_grad_db_postings = get_postings_from_db(Users.NEW_GRAD)

    # fetch all postings from web
    intern_web_postings = get_postings_from_web(Users.INTERN)
    new_grad_web_postings = get_postings_from_web(Users.NEW_GRAD)

    # calculate which postings are new
    new_intern_postings = get_new_postings(intern_db_postings, intern_web_postings)
    new_new_grad_postings = get_new_postings(
        new_grad_db_postings, new_grad_web_postings
    )

    new_intern_postings_exist = new_intern_postings is not None and len(new_intern_postings) != 0
    new_new_grad_postings_exist = new_new_grad_postings is not None and len(new_new_grad_postings) != 0

    if new_intern_postings_exist and new_new_grad_postings_exist:
        all_recipients = get_all_recipients_from_db()
        intern_recipients = filter_recipients(all_recipients, Users.INTERN)
        new_grad_recipients = filter_recipients(all_recipients, Users.NEW_GRAD)
        both_recipients = filter_recipients(all_recipients, Users.BOTH)
    elif new_intern_postings_exist:
        intern_and_both_recipients = get_recipients_from_db_by_is_intern(Users.INTERN)
        intern_recipients = filter_recipients(intern_and_both_recipients, Users.INTERN)
        both_recipients = filter_recipients(intern_and_both_recipients, Users.BOTH)
    else:
        new_grad_and_both_recipients = get_recipients_from_db_by_is_intern(Users.NEW_GRAD)
        new_grad_recipients = filter_recipients(new_grad_and_both_recipients, Users.NEW_GRAD)
        both_recipients = filter_recipients(new_grad_and_both_recipients, Users.BOTH)

    # send out new intern postings if there are any
    if new_intern_postings_exist:
        update_db_postings(new_intern_postings, Users.INTERN)
        intern_table = build_email_html(new_intern_postings)
        email_title_intern = build_email_title(new_intern_postings)
        send_mail(intern_recipients, intern_table, email_title_intern)
        email_title_both = build_email_title(new_intern_postings, Users.BOTH)
        send_mail(both_recipients, intern_table, email_title_both)
    else:
        print('No new intern postings!')

    # send out new new grad postings if there are any
    if new_new_grad_postings_exist:
        update_db_postings(new_new_grad_postings, Users.NEW_GRAD)
        new_grad_table = build_email_html(new_new_grad_postings)
        email_title = build_email_title(new_new_grad_postings)
        send_mail(new_grad_recipients, new_grad_table, email_title)
        email_title_both = build_email_title(new_intern_postings, Users.BOTH)
        send_mail(both_recipients, intern_table, email_title_both)
    else:
        print('No new new grad postings!')

    return {'statusCode': 200, 'body': json.dumps('Postings sent!')}


def get_all_recipients_from_db():
    GET_URL = USERS_URL

    response = requests.get(GET_URL)
    if not response.ok:
        print('Error fetching all recipients:', response.status_code)
        return None

    data = response.json()
    return data


def get_recipients_from_db_by_is_intern(user_type):
    GET_URL = USERS_URL
    GET_URL += '/intern' if user_type == Users.INTERN else '/newgrad'

    response = requests.get(GET_URL)
    if not response.ok:
        target_group = 'intern' if user_type == Users.INTERN else 'new grad'
        print('Error fetching', target_group, 'recipients:', response.status_code)
        return None

    data = response.json()
    return data


def filter_recipients(recipients, user_type):
    result = []
    for recipient in recipients:
        if recipient['preferenceList'] == 'BOTH' and user_type == Users.BOTH:
            result.append(recipient)
        elif recipient['preferenceList'] == 'INTERN' and user_type == Users.INTERN:
            result.append(recipient)
        elif recipient['preferenceList'] == 'NEWGRAD' and user_type == Users.NEW_GRAD:
            result.append(recipient)
    return result


def get_postings_from_db(user_type):
    GET_URL = POSTINGS_URL

    response = requests.get(GET_URL)
    if not response.ok:
        print('Error fetching postings from database:', response.status_code)
        return None

    data = response.json()
    if user_type == Users.INTERN:
        return data['InternPosts']
    else:
        return data['NewGradPosts']


def get_postings_from_web(user_type):
    PITTCSC_INTERNSHIP_URL = 'https://github.com/pittcsc/Summer2023-Internships'
    CODERQUAD_NEW_GRAD_URL = 'https://github.com/coderQuad/New-Grad-Positions-2023'

    page = requests.get(PITTCSC_INTERNSHIP_URL if user_type == Users.INTERN else CODERQUAD_NEW_GRAD_URL)

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
        except:  # no url --> posting closed
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
            'isIntern': user_type == Users.INTERN,
        }
        result.append(json_posting)

    return result


def get_new_postings(db_postings_data, web_postings_data):
    # key: email, value: json posting
    db_map = {posting['url']: posting for posting in db_postings_data}
    web_map = {posting['url']: posting for posting in web_postings_data}

    # calculate set difference to get new emails
    new_urls = set(web_map.keys()).difference(set(db_map.keys()))

    result = []
    for url in new_urls:
        result.append(web_map[url])
    return result


def update_db_postings(new_postings, user_type):
    POST_URL = POSTINGS_URL
    response = requests.post(POST_URL, json=new_postings)
    print(
        'Attempting to update database with new '
        + ('intern ' if user_type == Users.INTERN else 'new grad ')
        + 'postings...'
    )
    print(response)


def send_mail(recipients, email_html, email_title):
    # setup
    FROM_EMAIL = 'jobs@apptrack.tech'

    if recipients is None:
        print('no recipients')
        return

    # send data
    errors = []
    for recipient in recipients:
        result = 'didn\'t get a result'
        try:
            unsub_link = (
                '<div class="unsub_link"><a href="https://apptrack.tech/unsubscribe/'
                + recipient['id']
                + '">Unsubscribe</a></div></div></body></html>'
            )
            result = requests.post(
                "https://api.mailgun.net/v3/mg.apptrack.tech/messages",
                auth=("api", os.getenv("MAILGUN_API_KEY")),
                data={
                    "from": "AppTrack " + FROM_EMAIL,
                    "to": [recipient['emailAddress']],
                    "subject": email_title,
                    "html": email_html + unsub_link,
                },
            )

            print('email message status:', result.status_code)
            print(result.json())
            if int(result.status_code) != 200:
                errors.append((result.status_code, recipient['emailAddress']))
        except:
            errors.append(result)
    print('email errors:', errors)
    return errors


def build_email_title(postings, user_type, posting_type=None):
    initial = ''
    if user_type == Users.BOTH and posting_type is not None:
        initial += '[' + posting_type + '] '
        
    company_names = [posting['company'] for posting in postings]
    if len(postings) == 1:
        return initial + 'New job posting from ' + company_names[0] + '!'
    if len(postings) == 2:
        company_names_str = company_names[0] + ' and ' + company_names[1]
    elif len(postings) == 3:
        company_names_str = ', '.join(company_names[:-1]) + ', and ' + company_names[-1]
    else:
        company_names_str = ', '.join(company_names[:3]) + ', and more'
    return initial + 'New job postings from ' + company_names_str + '!'


def build_email_html(postings):
    table = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>APPTRACK Daily Update</title><style>@import url("https://fonts.googleapis.com/css2?family=Sen:wght@400;700;800&display=swap");body{margin: 0;background-color: #f5f5f4;color: #292524;font-family: "Sen", sans-serif;}h1{text-align: center;margin: 0;padding-top: 40px;padding-bottom: 40px;font-size:48px;}h3{margin: 0;}p{margin-top: 10px;margin-bottom: 15px;}a{color: inherit !important;text-decoration: none!important;}.wrapper{max-width: 500px;margin: 0 auto;padding: 0 10px;}.post{display: table;width: 100%;margin-bottom: 40px;border-bottom: 2px solid #78716c;}.posting_link{display: table-cell;text-align: right;vertical-align: middle;color: #ef4444 !important;text-decoration: underline;min-width: 62px;font-size: 18px;}.posting_details{display: table-cell;width: 100%;}.unsub_link{text-align: center;text-decoration: underline;padding-bottom: 40px;}</style></head><body><div class="wrapper"><h1><a href="https://apptrack.tech" text-decoration: none;>APPTRACK</a></h1>'
    for posting in postings:
        table += build_posting_html(posting)
    return table


def build_posting_html(posting):
    result = '<div class="post"><div class="posting_details"><h3>'
    result += posting['company']
    result += '</h3><p>'
    result += posting['location']
    result += '</p></div><a class="posting_link" href="'
    result += posting['url']
    result += '">Apply</a></div>'
    return result
