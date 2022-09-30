//Solidity Version
pragma solidity >= 0.6.4;

// Store a single data point and allow fetching/updating of that datapoint
contract SimpleStorage {
    
    // data point
    string public partName;
    string public techName;
    string public locationOfInstall;
    
    event myEventTest(string eventOutput1, string eventOutput2, string eventOutput3);
    
    // function set(string memory part, string memory tech, string memory loc) public {
    //     partName = part;
    //     techName = tech;
    //     locationOfInstall = loc;
    //     emit myEventTest(part, tech, loc);
    // }

    function set_Part(string memory partname) public
    {
        partName = partname;
    }
    
    function set_Tech(string memory techname) public
    {
        techName = techname;
    }

    function set_Loc(string memory loc) public
    {
        locationOfInstall = loc;
    }

    function get() public view returns (string memory, string memory, string memory) {
        return (partName, techName, locationOfInstall);
    }
    
}