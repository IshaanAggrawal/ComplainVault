const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ComplaintSystem", function () {
  let ComplaintSystem;
  let complaintSystem;
  let admin, user1, resolver;

  beforeEach(async function () {
    [admin, user1, resolver] = await ethers.getSigners();
    ComplaintSystem = await ethers.getContractFactory("ComplaintSystem");
    complaintSystem = await ComplaintSystem.deploy();
    await complaintSystem.deployed();
  });

  it("Should set the right admin", async function () {
    expect(await complaintSystem.admin()).to.equal(admin.address);
  });

  it("Should allow a user to file a complaint", async function () {
    const description = "Streetlight not working";
    const department = 2; // Electricity

    await expect(complaintSystem.connect(user1).fileComplaint(description, department))
      .to.emit(complaintSystem, "ComplaintFiled");

    const count = await complaintSystem.complaintCount();
    expect(count).to.equal(1);

    const complaint = await complaintSystem.getComplaint(0);
    expect(complaint.user).to.equal(user1.address);
    expect(complaint.description).to.equal(description);
    expect(complaint.resolved).to.be.false;
  });

  it("Should not allow non-admin to resolve a complaint", async function () {
    await complaintSystem.connect(user1).fileComplaint("Test complaint", 0);
    await expect(
      complaintSystem.connect(user1).resolveComplaint(0)
    ).to.be.revertedWith("Only admin can perform this action");
  });

  it("Should allow admin to resolve a complaint", async function () {
    await complaintSystem.connect(user1).fileComplaint("Fix the water supply", 3);
    await expect(complaintSystem.connect(admin).resolveComplaint(0))
      .to.emit(complaintSystem, "ComplaintResolved");

    const complaint = await complaintSystem.getComplaint(0);
    expect(complaint.resolved).to.be.true;
    expect(complaint.resolver).to.equal(admin.address);
  });

  it("Should allow admin to change admin", async function () {
    await complaintSystem.connect(admin).changeAdmin(resolver.address);
    expect(await complaintSystem.admin()).to.equal(resolver.address);
  });

  it("Should return all complaints", async function () {
    await complaintSystem.connect(user1).fileComplaint("Water leakage", 3);
    await complaintSystem.connect(user1).fileComplaint("Broken road", 4);

    const allComplaints = await complaintSystem.getAllComplaints();
    expect(allComplaints.length).to.equal(2);
  });
});
