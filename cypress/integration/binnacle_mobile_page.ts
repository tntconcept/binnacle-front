import BinnacleMobilePO from "../page_objects/BinnacleMobilePO"

context.skip("Binnacle Mobile Page", () => {

  it("should update time stats when an activity is created", () => {
    BinnacleMobilePO.swipeNextWeek()
  })
});
