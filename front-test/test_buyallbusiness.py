import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities


class TestFillordersuccess():
  def setup_method(self):
    self.driver = webdriver.Firefox(executable_path="./drivers/geckodriver")
    self.vars = {}

  def teardown_method(self):
    self.driver.quit()

  def test(self):
    self.driver.get("http://localhost:3000/view/3")
    self.driver.set_window_size(1070, 950)
    time.sleep(2)
    self.driver.find_element(
        By.CSS_SELECTOR, "#view-buy-button > .MuiButton-label").click()

    time.sleep(2)
    self.driver.find_element(By.ID, "order-business-class").click()
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
        By.CSS_SELECTOR, "#order-dialog-p-online > .MuiButton-label").click()

    time.sleep(2)
    self.driver.find_element(By.ID, "cardNumber").click()
    self.driver.find_element(
        By.ID, "cardNumber").send_keys("4242 4242 4242 4242")
    self.driver.find_element(By.ID, "email").click()
    self.driver.find_element(By.ID, "email").send_keys("test@example.com")
    self.driver.find_element(By.ID, "cardExpiry").click()
    self.driver.find_element(By.ID, "cardExpiry").send_keys("02 / 22")
    self.driver.find_element(By.ID, "cardCvc").click()
    self.driver.find_element(By.ID, "cardCvc").send_keys("222")
    self.driver.find_element(By.ID, "billingName").click()
    self.driver.find_element(By.ID, "billingName").send_keys("test")
    self.driver.find_element(
        By.CSS_SELECTOR, ".SubmitButton-IconContainer").click()

    time.sleep(7)

  def run_test(self, name):
    self.setup_method()
    self.test()
    self.teardown_method()
    print(name, 'SUCCESS')


TestFillordersuccess().run_test('Buy All Business Tickets')
