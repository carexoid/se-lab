import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities


class TestCancel():
  def setup_method(self):
    self.driver = webdriver.Firefox(executable_path="./drivers/geckodriver")
    self.vars = {}

  def teardown_method(self):
    self.driver.quit()

  def test(self):
    self.driver.get("http://localhost:3000/view/14")
    self.driver.set_window_size(1070, 950)
    time.sleep(2)
    self.driver.find_element(
        By.CSS_SELECTOR, "#view-buy-button > .MuiButton-label").click()

    time.sleep(2)
    self.driver.find_element(By.ID, "order-quantity").send_keys("1")
    self.driver.find_element(By.ID, "order-quantity").click()
    self.driver.find_element(By.ID, "order-comment").click()
    self.driver.find_element(By.ID, "order-comment").send_keys("I hate olives")
    self.driver.find_element(
        By.CSS_SELECTOR, ".MuiGrid-grid-md-10:nth-child(6)").click()
    self.driver.find_element(
        By.CSS_SELECTOR, "#order-choose-pm > .MuiButton-label").click()
    self.driver.find_element(
        By.CSS_SELECTOR, "#order-dialog-cancel > .MuiButton-label").click()

    self.driver.find_element(By.ID, "breadcrumb-browse").click()
    time.sleep(2)

  def run_test(self, name):
    self.setup_method()
    self.test()
    self.teardown_method()
    print(name, 'SUCCESS')


TestCancel().run_test('Cancel Order')
