import LoginPO from "../page_objects/LoginPO";
import BinnacleMobilePO from "../page_objects/BinnacleMobilePO";

context.only("Binnacle Mobile Page", () => {
  beforeEach(() => {
    cy.request('http://localhost:8080/db/seed')

    cy.viewport('iphone-xr')

    LoginPO.visit();
    LoginPO.login();
  });

  it("should update time stats when an activity is created", () => {
    BinnacleMobilePO.swipeNextWeek()
  })
});
