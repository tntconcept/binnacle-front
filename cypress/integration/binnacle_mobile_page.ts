import BinnacleMobilePO from "../page_objects/BinnacleMobilePO"
import LoginPO from "../page_objects/LoginPO"

context("Binnacle Mobile Page", () => {

  beforeEach(() => {
    cy.viewport("iphone-xr")

    LoginPO.visit();
    LoginPO.login();
  });

  it("should update time stats when an activity is created", () => {
    BinnacleMobilePO.swipeNextWeek()



  })
});
