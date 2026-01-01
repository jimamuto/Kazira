import time
import logging
from typing import List, Dict, Any
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

class IndeedScraper:
    """
    Scrapes Indeed Job postings using Selenium.
    Note: Indeed has strong anti-scraping measures. This is a simplified implementation.
    """
    
    def __init__(self, headless: bool = True):
        self.options = Options()
        if headless:
            self.options.add_argument("--headless")
        self.options.add_argument("--no-sandbox")
        self.options.add_argument("--disable-dev-shm-usage")
        self.options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        
    def _init_driver(self):
        return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=self.options)

    def scrape_jobs(self, query: str, location: str = "Kenya", limit: int = 5) -> List[Dict[str, Any]]:
        logging.info(f"Starting Indeed scrape for '{query}' in {location}")
        
        # Revert to global indeed.com as it handles headless redirects better
        search_url = f"https://www.indeed.com/jobs?q={query.replace(' ', '+')}&l={location.replace(' ', '+')}"
        
        driver = self._init_driver()
        jobs = []
        
        try:
            driver.get(search_url)
            time.sleep(5) 
            
            soup = BeautifulSoup(driver.page_source, "html.parser")
            # Loose selectors to catch various Indeed layouts
            job_cards = soup.find_all("div", class_="job_seen_beacon") or \
                        soup.find_all("td", class_="resultContent") or \
                        soup.select(".tapItem, .result")

            for card in job_cards[:limit]:
                try:
                    title_elem = card.find("h2", class_="jobTitle") or card.select_one(".jobTitle")
                    if not title_elem: continue
                    title = title_elem.text.strip().replace("new", "")
                    
                    company_elem = card.find("span", {"data-testid": "company-name"}) or \
                                   card.find("span", class_="companyName") or \
                                   card.select_one(".companyName")
                    
                    company_name = company_elem.text.strip() if company_elem else "Indeed Partner"
                    
                    link_elem = title_elem.find("a") or card.find("a")
                    link = "https://www.indeed.com" + link_elem["href"] if link_elem and link_elem.get("href") else search_url
                    
                    if "***" in title or "***" in company_name:
                        logging.warning(f"Skipping redacted Indeed job: {title} @ {company_name}")
                        continue

                    jobs.append({
                        "title": title,
                        "company": company_name,
                        "link": link,
                        "source": "Indeed"
                    })
                except Exception as e:
                    logging.warning(f"Failed to parse Indeed job card: {e}")
                    
            logging.info(f"Successfully scraped {len(jobs)} jobs from Indeed.")
            
        except Exception as e:
            logging.error(f"Indeed scraping failed: {e}")
        finally:
            driver.quit()
            
        return jobs
