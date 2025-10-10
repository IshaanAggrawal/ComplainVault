// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ComplaintSystem {
    address public admin;

    enum Department { General, Police, Electricity, Water, Transport }

    struct Complaint {
        uint id;
        address user;
        string description;
        Department department;
        uint timestamp;
        bool resolved;
        address resolver;
        string ipfsHash; // IPFS hash for file attachments
        string[] fileHashes; // Array of IPFS hashes for multiple files
    }
    mapping(uint => Complaint) public complaints;
    uint public complaintCount;

    event ComplaintFiled(uint id, address indexed user, Department department, string description, uint timestamp, string ipfsHash);
    event ComplaintResolved(uint id, address indexed resolver, uint timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyUser(uint complaintId) {
        require(complaints[complaintId].user == msg.sender, "Only the complaint owner can perform this action");
        _;
    }

    modifier complaintExists(uint complaintId) {
        require(complaintId < complaintCount, "Complaint does not exist");
        _;
    }

    constructor() {
        admin = msg.sender;
        complaintCount = 0;
    }
    function fileComplaint(string memory description, Department department) public {
        fileComplaintWithIPFS(description, department, "");
    }

    function fileComplaintWithIPFS(string memory description, Department department, string memory ipfsHash) public {
        complaints[complaintCount] = Complaint({
            id: complaintCount,
            user: msg.sender,
            description: description,
            department: department,
            timestamp: block.timestamp,
            resolved: false,
            resolver: address(0),
            ipfsHash: ipfsHash,
            fileHashes: new string[](0)
        });
        emit ComplaintFiled(complaintCount, msg.sender, department, description, block.timestamp, ipfsHash);
        complaintCount++;
    }

    function addFileToComplaint(uint complaintId, string memory fileHash) public onlyUser(complaintId) complaintExists(complaintId) {
        complaints[complaintId].fileHashes.push(fileHash);
    }
    function resolveComplaint(uint complaintId) public onlyAdmin complaintExists(complaintId) {
        Complaint storage complaint = complaints[complaintId];
        require(!complaint.resolved, "Complaint already resolved");
        complaint.resolved = true;
        complaint.resolver = msg.sender;
        emit ComplaintResolved(complaintId, msg.sender, block.timestamp);
    }
    function getComplaint(uint complaintId) public view complaintExists(complaintId) returns (Complaint memory) {
        return complaints[complaintId];
    }
    function getAllComplaints() public view returns (Complaint[] memory) {
        Complaint[] memory allComplaints = new Complaint[](complaintCount);
        for (uint i = 0; i < complaintCount; i++) {
            allComplaints[i] = complaints[i];
        }
        return allComplaints;
    }
    function changeAdmin(address newAdmin) public onlyAdmin {
        require(newAdmin != address(0), "Invalid address");
        admin = newAdmin;
    }
    
}
