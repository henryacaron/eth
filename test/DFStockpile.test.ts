import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import {
  fixtureLoader,
  increaseBlockchainTime,
  makeInitArgs,
  makeMoveArgs,
} from './utils/TestUtils';
import { defaultWorldFixture, growingWorldFixture, World, specialWeaponsWorldFixture } from './utils/TestWorld';
import {
  LVL1_ASTEROID_1,
  SPAWN_PLANET_1,
  SPAWN_PLANET_2,
  initializers
} from './utils/WorldConstants';

const { BigNumber: BN } = ethers;

describe('DarkForestSpecialWeapons', function () {
  let world: World;
  const destroyThresold = 2;

  beforeEach(async function () {
    console.log("here");
    world = await fixtureLoader(specialWeaponsWorldFixture);

    await world.user1Core.initializePlayer(...makeInitArgs(SPAWN_PLANET_1));
    await world.user2Core.initializePlayer(...makeInitArgs(SPAWN_PLANET_2));
    world.contracts.core.changeDestroyThreshold(destroyThresold);
  });

  it('should get player stockpile', async function () {
    
    expect(await world.user1Core.getPlayerStockpile(world.user1.address)).to.equal(0);
    expect(await world.user2Core.getPlayerStockpile(world.user2.address)).to.equal(0);
  });
});