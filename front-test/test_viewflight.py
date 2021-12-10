# Generated by Selenium IDE
import pytest
import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

class TestViewflight():
  def setup_method(self):
    self.driver = webdriver.Firefox(executable_path="./drivers/geckodriver")
    self.vars = {}
  
  def teardown_method(self):
    self.driver.quit()
  
  def test(self):
    self.driver.get("http://localhost:3000/")
    self.driver.set_window_size(1053, 896)
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(2) .MuiButtonBase-root:nth-child(2) .MuiSvgIcon-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(2) .MuiButtonBase-root:nth-child(2) .MuiSvgIcon-root").click()
    self.driver.find_element(By.ID, "browse-filter-destination-option-0").click()
    self.driver.find_element(By.ID, "browse-search-button").click()
    self.driver.execute_script("window.scrollTo(0,458)")
    time.sleep(5)
    self.driver.find_element(By.ID, "browse-link-2").click()
    time.sleep(5)
    self.driver.find_element(By.ID, "breadcrumb-browse").click()

  def run_test(self, name):
    self.setup_method()
    self.test()
    self.teardown_method()
    print(name,'SUCCESS')
  

TestViewflight().run_test('View Flight')