const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IPFS Integration Tests", function () {
  let complaintSystem;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const ComplaintSystem = await ethers.getContractFactory("ComplaintSystem");
    complaintSystem = await ComplaintSystem.deploy();
    await complaintSystem.waitForDeployment();
  });

  describe("Complaint Filing with IPFS", function () {
    it("Should file a complaint with IPFS hash", async function () {
      const description = "Test complaint with IPFS";
      const department = 0; // General
      const ipfsHash = "QmTestHash123456789";

      const tx = await complaintSystem.connect(user1).fileComplaintWithIPFS(
        description,
        department,
        ipfsHash
      );

      await expect(tx)
        .to.emit(complaintSystem, "ComplaintFiled")
        .withArgs(0, user1.address, department, description, await getCurrentTimestamp(), ipfsHash);

      const complaint = await complaintSystem.getComplaint(0);
      expect(complaint.ipfsHash).to.equal(ipfsHash);
      expect(complaint.description).to.equal(description);
      expect(complaint.user).to.equal(user1.address);
    });

    it("Should file a complaint without IPFS hash", async function () {
      const description = "Test complaint without IPFS";
      const department = 1; // Police

      const tx = await complaintSystem.connect(user1).fileComplaint(
        description,
        department
      );

      await expect(tx)
        .to.emit(complaintSystem, "ComplaintFiled")
        .withArgs(0, user1.address, department, description, await getCurrentTimestamp(), "");

      const complaint = await complaintSystem.getComplaint(0);
      expect(complaint.ipfsHash).to.equal("");
      expect(complaint.description).to.equal(description);
    });

    it("Should add files to existing complaint", async function () {
      // First file a complaint
      await complaintSystem.connect(user1).fileComplaintWithIPFS(
        "Test complaint",
        0,
        "QmMainHash"
      );

      // Add additional files
      const additionalHash1 = "QmAdditionalHash1";
      const additionalHash2 = "QmAdditionalHash2";

      await complaintSystem.connect(user1).addFileToComplaint(0, additionalHash1);
      await complaintSystem.connect(user1).addFileToComplaint(0, additionalHash2);

      const complaint = await complaintSystem.getComplaint(0);
      expect(complaint.fileHashes.length).to.equal(2);
      expect(complaint.fileHashes[0]).to.equal(additionalHash1);
      expect(complaint.fileHashes[1]).to.equal(additionalHash2);
    });

    it("Should not allow non-owner to add files to complaint", async function () {
      // User1 files a complaint
      await complaintSystem.connect(user1).fileComplaintWithIPFS(
        "Test complaint",
        0,
        "QmMainHash"
      );

      // User2 tries to add file (should fail)
      await expect(
        complaintSystem.connect(user2).addFileToComplaint(0, "QmUnauthorizedHash")
      ).to.be.revertedWith("Only the complaint owner can perform this action");
    });

    it("Should not allow adding files to non-existent complaint", async function () {
      await expect(
        complaintSystem.connect(user1).addFileToComplaint(999, "QmHash")
      ).to.be.revertedWith("Complaint does not exist");
    });
  });

  describe("Complaint Retrieval with IPFS", function () {
    beforeEach(async function () {
      // File multiple complaints with different IPFS hashes
      await complaintSystem.connect(user1).fileComplaintWithIPFS(
        "Complaint 1",
        0,
        "QmHash1"
      );

      await complaintSystem.connect(user2).fileComplaintWithIPFS(
        "Complaint 2",
        1,
        "QmHash2"
      );

      await complaintSystem.connect(user1).fileComplaint(
        "Complaint 3",
        2
      );
    });

    it("Should retrieve complaint with IPFS hash", async function () {
      const complaint = await complaintSystem.getComplaint(0);
      expect(complaint.ipfsHash).to.equal("QmHash1");
      expect(complaint.description).to.equal("Complaint 1");
    });

    it("Should retrieve all complaints with IPFS data", async function () {
      const complaints = await complaintSystem.getAllComplaints();
      expect(complaints.length).to.equal(3);
      
      expect(complaints[0].ipfsHash).to.equal("QmHash1");
      expect(complaints[1].ipfsHash).to.equal("QmHash2");
      expect(complaints[2].ipfsHash).to.equal("");
    });
  });

  describe("Admin Functions", function () {
    beforeEach(async function () {
      await complaintSystem.connect(user1).fileComplaintWithIPFS(
        "Test complaint",
        0,
        "QmHash"
      );
    });

    it("Should allow admin to resolve complaint", async function () {
      const tx = await complaintSystem.connect(owner).resolveComplaint(0);
      
      await expect(tx)
        .to.emit(complaintSystem, "ComplaintResolved")
        .withArgs(0, owner.address, await getCurrentTimestamp());

      const complaint = await complaintSystem.getComplaint(0);
      expect(complaint.resolved).to.be.true;
      expect(complaint.resolver).to.equal(owner.address);
    });

    it("Should not allow non-admin to resolve complaint", async function () {
      await expect(
        complaintSystem.connect(user1).resolveComplaint(0)
      ).to.be.revertedWith("Only admin can perform this action");
    });
  });

  // Helper function to get current timestamp
  async function getCurrentTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }
});
