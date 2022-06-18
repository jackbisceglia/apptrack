import requests
from bs4 import BeautifulSoup

import json

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
    for internship in data:
        print('Name:', internship[0])
        print('Location:', internship[1])
        print('Notes:', internship[2])
        print('')
        
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }