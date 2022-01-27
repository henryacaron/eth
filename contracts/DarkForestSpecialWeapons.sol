// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./DarkForestPlanet.sol";
import "./DarkForestStorageV1.sol";

library DarkForestSpecialWeapons {

    event PlanetTransferred(address sender, uint256 loc, address receiver);
    event PlanetDestroyed(address player, uint256 loc);

    function getGameStorage() public pure returns (DarkForestTypes.GameStorage storage ret) {
        bytes32 position = bytes32(uint256(1));
        assembly {
            ret.slot := position
        }
    }

    // alias for accessing storage vars
    function s() public pure returns (DarkForestTypes.GameStorage storage ret) {
        ret = getGameStorage();
    }

    function useSpecial(uint256 _location, uint8 _specialId) 
        public
    {
        require(!s().players[msg.sender].usedSpecial, "player already used special");
        // refreshPlanet(_location);
        require(_specialId < 2, "incorrect special item index");
        // require that the planet is initialized (?)
        
        if(_specialId == 0){
            useHijack(_location);
        } else if (_specialId == 1) {
            useDestroy(_location);
        }
        // if(specialId == 0) useDeathRay(locationId);
        // else if(specialId == 1) useTakeOver(locationId);
        s().players[msg.sender].usedSpecial = true;
    }

	// modified transferOwnership that doesnt require msg.sender to be the owner
    function useHijack(uint256 _location) private {
        address owner = s().planets[_location].owner;
	    //require planet is initialized
        require(
            s().planetsExtendedInfo[_location].isInitialized == true,
            "Planet is not initialized"
        );

        //refresh planet
        DarkForestPlanet.refreshPlanet(_location);

        // require planet owner is not msg.sender
        require(owner != msg.sender, "Cannot transfer your own planet");
        // require player = msg.sender
 
        // require planet is not destroyed
        require(!s().planetsExtendedInfo[_location].destroyed, "can't transfer a destroyed planet");

        // set planet owner to player
        s().planets[_location].owner = msg.sender;

        // emit takeover message
        emit PlanetTransferred(owner, _location, msg.sender);

    }

    function useDestroy(uint256 _location) private {
        address owner = s().planets[_location].owner;
        require(
                    s().planetsExtendedInfo[_location].isInitialized == true,
                    "Planet is not initialized"
                );

        //refresh planet
        DarkForestPlanet.refreshPlanet(_location);
 
        // require planet is not destroyed
        require(!s().planetsExtendedInfo[_location].destroyed, "planet already destroyed");

        // set planet owner to player
        s().planetsExtendedInfo[_location].destroyed = true;
        emit PlanetDestroyed(owner, _location);
    }

}