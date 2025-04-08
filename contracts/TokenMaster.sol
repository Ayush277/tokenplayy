// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenMaster is ERC721, Ownable {
    uint256 public totalOccasions;
    uint256 public totalSupply;

    struct Occasion {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    mapping(uint256 => Occasion) public occasions;
    mapping(uint256 => mapping(address => bool)) public hasBought;
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;
    mapping(uint256 => uint256[]) seatsTaken;

    // Events
    event OccasionListed(
        uint256 indexed id,
        string name,
        uint256 cost,
        uint256 maxTickets,
        string date,
        string time,
        string location
    );

    event TicketMinted(
        uint256 indexed occasionId,
        address indexed buyer,
        uint256 seat
    );

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        transferOwnership(msg.sender);
    }

    function list(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner {
        occasions[totalOccasions] = Occasion(
            totalOccasions,
            _name,
            _cost,
            _maxTickets,
            _maxTickets,
            _date,
            _time,
            _location
        );

        emit OccasionListed(
            totalOccasions,
            _name,
            _cost,
            _maxTickets,
            _date,
            _time,
            _location
        );

        totalOccasions++;
    }

    function mint(uint256 _id, uint256 _seat) public payable {
        require(_id < totalOccasions, "Invalid event ID");
        require(msg.value >= occasions[_id].cost, "Insufficient ETH");
        require(seatTaken[_id][_seat] == address(0), "Seat already taken");
        require(_seat > 0 && _seat <= occasions[_id].maxTickets, "Invalid seat number");

        occasions[_id].tickets -= 1;
        hasBought[_id][msg.sender] = true;
        seatTaken[_id][_seat] = msg.sender;
        seatsTaken[_id].push(_seat);

        totalSupply++;

        _safeMint(msg.sender, totalSupply);
        emit TicketMinted(_id, msg.sender, _seat);
    }

    function getOccasion(uint256 _id) public view returns (Occasion memory) {
        return occasions[_id];
    }

    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatsTaken[_id];
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }
}
