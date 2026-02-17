// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentPredictionMarket {
    address public owner;
    address public relayer;

    struct Market {
        uint256 id;
        string question;
        uint256 endTime;
        bool resolved;
        uint8 winningSide;
        bool exists;
    }

    struct Position {
        uint256 yesShares;
        uint256 noShares;
    }

    mapping(address => bool) public isAgent;
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => Position)) public positions;

    uint256 public nextMarketId;

    event OwnerChanged(address indexed previousOwner, address indexed newOwner);
    event RelayerChanged(address indexed previousRelayer, address indexed newRelayer);
    event AgentRegistered(address indexed agent);
    event MarketCreated(uint256 indexed marketId, string question, uint256 endTime);
    event TradeExecuted(uint256 indexed marketId, address indexed agent, uint8 side, uint256 stake);
    event MarketResolved(uint256 indexed marketId, uint8 winningSide);

    modifier onlyOwner() {
        require(msg.sender == owner, "Owner only");
        _;
    }

    modifier onlyRelayer() {
        require(msg.sender == relayer, "Relayer only");
        _;
    }

    constructor(address initialRelayer) {
        owner = msg.sender;
        relayer = initialRelayer;
        emit OwnerChanged(address(0), msg.sender);
        emit RelayerChanged(address(0), initialRelayer);
    }

    function setOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero owner");
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }

    function setRelayer(address newRelayer) external onlyOwner {
        require(newRelayer != address(0), "Zero relayer");
        emit RelayerChanged(relayer, newRelayer);
        relayer = newRelayer;
    }

    function registerAgent(address agent) external onlyRelayer {
        require(agent != address(0), "Zero agent");
        require(!isAgent[agent], "Already agent");
        isAgent[agent] = true;
        emit AgentRegistered(agent);
    }

    function addMarket(string calldata question, uint256 endTime) external onlyOwner returns (uint256) {
        require(endTime > block.timestamp, "End time must be future");
        uint256 marketId = nextMarketId;
        nextMarketId += 1;

        markets[marketId] = Market({
            id: marketId,
            question: question,
            endTime: endTime,
            resolved: false,
            winningSide: 0,
            exists: true
        });

        emit MarketCreated(marketId, question, endTime);
        return marketId;
    }

    function trade(
        uint256 marketId,
        address agent,
        uint8 side,
        uint256 stake
    ) external onlyRelayer {
        require(isAgent[agent], "Unknown agent");
        Market storage m = markets[marketId];
        require(m.exists, "No market");
        require(!m.resolved, "Resolved");
        require(block.timestamp < m.endTime, "Ended");
        require(stake > 0, "Zero stake");
        require(side == 1 || side == 2, "Invalid side");

        Position storage p = positions[marketId][agent];
        if (side == 1) {
            p.yesShares += stake;
        } else {
            p.noShares += stake;
        }

        emit TradeExecuted(marketId, agent, side, stake);
    }

    function resolveMarket(uint256 marketId, uint8 winningSide) external onlyOwner {
        require(winningSide == 1 || winningSide == 2, "Invalid side");
        Market storage m = markets[marketId];
        require(m.exists, "No market");
        require(!m.resolved, "Already resolved");
        m.resolved = true;
        m.winningSide = winningSide;
        emit MarketResolved(marketId, winningSide);
    }
}

