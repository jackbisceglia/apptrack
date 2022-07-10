from typing import List
import requests
from bs4 import BeautifulSoup


HARDCODED = {"Meta": "Facebook", "Cisco (Meraki)": "Cisco-Meraki", "D. E. Shaw & Co.": "D-E-Shaw"}


def lambda_handler(event=None, context=None):
    pass


def get_companies_intern_hourly_rate(companies: List[str]):
    return list(map(get_company_intern_hourly_rate, companies))


def get_company_intern_hourly_rate(company: str):
    hardcoded_company = get_hardcoded_company_name(company)
    parts = [part.capitalize() for part in company.split()]
    company = hardcoded_company or "-".join(parts)

    response = requests.get(f"https://www.levels.fyi/internships/{company}/Software-Engineer-Intern/")
    if response.status_code != 200:
        return None
    soup = BeautifulSoup(response.content, 'html.parser')
    pay = soup.find(id="most-recent-hourly").contents[0]
    pay = str(round(float(pay[1:])))
    return pay


def get_hardcoded_company_name(company: str):
    if company in HARDCODED:
        return HARDCODED[company]
    return None