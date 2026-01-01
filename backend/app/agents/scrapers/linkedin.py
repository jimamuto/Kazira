import time
import logging
from typing import List, Dict, Any
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

class LinkedInScraper:
    """
    Scrapes LinkedIn Job postings using Selenium.
    Note: Requires a stable internet connection and compatible Chrome browser.
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

    def scrape_jobs(self, query: str, location: str = "Kenya", limit: int = 10) -> List[Dict[str, Any]]:
        logging.info(f"Starting LinkedIn scrape for '{query}' in {location}")
        
        # Simplified search URL for public job listings
        search_url = f"https://www.linkedin.com/jobs/search/?keywords={query.replace(' ', '%20')}&location={location.replace(' ', '%20')}"
        
        driver = self._init_driver()
        jobs = []
        
        try:
            driver.get(search_url)
            time.sleep(3) # Initial load
            
            # Scroll to load more jobs (LinkedIn lazy load)
            for _ in range(2):
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)
            
            # Extract job cards
            soup = BeautifulSoup(driver.page_source, "html.parser")
            job_cards = soup.find_all("div", class_="base-card")
            
            for card in job_cards[:limit]:
                try:
                    title = card.find("h3", class_="base-search-card__title").text.strip()
                    company = card.find("h4", class_="base-search-card__subtitle").text.strip()
                    link = card.find("a", class_="base-card__full-link")["href"]
                    
                    if "***" in title or "***" in company:
                        logging.warning(f"Skipping redacted LinkedIn job: {title} @ {company}")
                        continue

                    jobs.append({
                        "title": title,
                        "company": company,
                        "link": link,
                        "source": "LinkedIn"
                    })
                except Exception as e:
                    logging.warning(f"Failed to parse job card: {e}")
                    
            logging.info(f"Successfully scraped {len(jobs)} jobs from LinkedIn.")
            
        except Exception as e:
            logging.error(f"LinkedIn scraping failed: {e}")
        finally:
            driver.quit()
            
        return jobs
