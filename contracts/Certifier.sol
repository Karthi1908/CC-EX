//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import './CCNFT.sol';

contract Certifier is Ownable {


    CCNFT public ccNFT;
    
    enum Status {Unassinged, Pending, Accepted, Rejected}
    uint applicationCount;
   

    struct Application {
        uint applicationNumber;
        address applicant;
        address assignedTo;
        string projectName;
        string projectDetails;
        string location;
        Status applicationStatus;
        uint creditsIssued;
    }

    mapping (address => bool) public Approvers;
    mapping (string => Application) public Applications;

    constructor(address _ccNFTAddress) {
        ccNFT = CCNFT(_ccNFTAddress);
    }

    function setCCNFTAddress(address _ccNFTAddress) public  onlyOwner {
        ccNFT = CCNFT(_ccNFTAddress);
    
    }

    function addApprover(address _wallet) public onlyOwner {
        Approvers[_wallet]=true;
    }

    function contains(address _wallet) public view returns (bool){
        return Approvers[_wallet];
    }

    function applyForCertification(  string memory _projectName, string memory _projectDetails, string memory _location  ) public {

        applicationCount++;

        Applications[_projectName] = Application(applicationCount,
                                                msg.sender,
                                                address(0),
                                               _projectName,
                                               _projectDetails,
                                               _location,
                                               Status.Unassinged,
                                               0);
    }

    function assignApplication( string memory _projectName, address _certifier ) public {

        require(contains(msg.sender), "Unauthorised Operation ");
        require(contains(_certifier), "Assignee Not an Approved Certifier ");
        Applications[_projectName].assignedTo= _certifier;
        Applications[_projectName].applicationStatus = Status.Pending;
    }

    function applicationDecision(string memory _projectName, Status _status, uint _creditsIssued) public {

        require(Applications[_projectName].assignedTo == msg.sender , "Not the Assigned Certifier");

        Applications[_projectName].applicationStatus = _status;

        if(_status == Status.Accepted) {
            
            Applications[_projectName].creditsIssued = _creditsIssued;
            ccNFT.mint('Vera', 
                       Applications[_projectName].projectName,
                       Applications[_projectName].location,
                       _creditsIssued,
                       Applications[_projectName].applicant);

        }







    }





}

