//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import './CCNFT.sol';

interface IPUSHCommInterface {
    function sendNotification(address _channel, address _recipient, bytes calldata _identity) external;
}


contract Certifier is Ownable {


    CCNFT public ccNFT;

    address public EPNS_COMM_ADDRESS = 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa;
    address public EPNS_CHANNEL_ADDRESS = 0x7F36cba7Da4F7915bf5775cBF91f08F2F8f7b67a;
    
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

    struct Certifiers {
        string company;
        bool status;

    }

    mapping (address => Certifiers) public Approvers;
    mapping (string => Application) public Applications;

    constructor(address _ccNFTAddress) {
        ccNFT = CCNFT(_ccNFTAddress);
    }

    event NewApplication(
        uint indexed applicationNumber,
        address indexed applicant,
        string indexed projectName,
        string projectDetails,
        string location
    );

    event ApplicationAssignment(

        address indexed assignor,
        address indexed assignee,
        string indexed projectName
    );

    event ApplicationResult(

        uint indexed applicationNumber,
        address applicant,
        address indexed assignedTo,
        string indexed projectName,
        string  applicationStatus,
        uint  creditsIssued
    );

    function setCCNFTAddress(address _ccNFTAddress) public  onlyOwner {
        ccNFT = CCNFT(_ccNFTAddress);
    
    }

    function addApprover(address _wallet, string memory _company) public onlyOwner {
        Approvers[_wallet]= Certifiers(_company,true);
    }

    function contains(address _wallet) public view returns (bool){
        return Approvers[_wallet].status;
    }

    function applyForCertification(  string memory _projectName, string memory _projectDetails, string memory _location  ) public {

        
        require(keccak256(abi.encodePacked((Applications[_projectName].projectName))) != keccak256(abi.encodePacked((_projectName))), 
                                                    "Application for this project already exists");
        applicationCount++;

        Applications[_projectName] = Application(applicationCount,
                                                msg.sender,
                                                address(0),
                                               _projectName,
                                               _projectDetails,
                                               _location,
                                               Status.Unassinged,
                                               0);
        emit NewApplication(applicationCount, msg.sender, _projectName, _projectDetails, _location);

        IPUSHCommInterface(EPNS_COMM_ADDRESS).sendNotification(
            EPNS_CHANNEL_ADDRESS, // from channel
            address(this), // to recipient, put address(this) in case you want Broadcast or Subset. For Targetted put the address to which you want to send
            bytes(
                string(
                    // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                    abi.encodePacked(
                        "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                        "+", // segregator
                        "1", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
                        "+", // segregator
                        "New Application", // this is notificaiton title
                        "+", // segregator
                        "A new Application for the project ", // notification body
                        _projectName,
                        " has been submitted by ",
                        Strings.toHexString(uint256(uint160(msg.sender)), 20), // notification body
                        " PUSH to you!" // notification body
                    )
                )
            )
        );
    }

    function assignApplication( string memory _projectName, address _certifier ) public {

        require(contains(msg.sender), "Unauthorised Operation ");
        require(contains(_certifier), "Assignee Not an Approved Certifier ");
        require( Applications[_projectName].applicationStatus == Status.Unassinged, "Already Assigned");
        Applications[_projectName].assignedTo= _certifier;
        Applications[_projectName].applicationStatus = Status.Pending;

        emit ApplicationAssignment(msg.sender ,_certifier , _projectName );
    }

    function applicationDecision(string memory _projectName, Status _status, uint _creditsIssued) public {

        require(Applications[_projectName].assignedTo == msg.sender , "Not the Assigned Certifier");

        Applications[_projectName].applicationStatus = _status;
        string memory status;

        if(_status == Status.Accepted) {

            status = 'Accepted';            
            Applications[_projectName].creditsIssued = _creditsIssued;
            ccNFT.mint(Approvers[msg.sender].company, 
                       Applications[_projectName].projectName,
                       Applications[_projectName].location,
                       _creditsIssued,
                       Applications[_projectName].applicant);

        } else {
            status = 'Rejected'; 
        }

        emit ApplicationResult( Applications[_projectName].applicationNumber,
                                Applications[_projectName].applicant,
                                Applications[_projectName].assignedTo,
                                _projectName,
                                status,
                                _creditsIssued
                                );

    }






}

