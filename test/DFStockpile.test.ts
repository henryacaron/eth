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
  LVL1_ASTEROID_2,
  SPAWN_PLANET_1,
  SPAWN_PLANET_2,
  initializers
} from './utils/WorldConstants';

const { BigNumber: BN } = ethers;

describe('DarkForestStockpile', function () {
  let world: World;
  const destroyThresold = 2;

  beforeEach(async function () {
    console.log("here");
    world = await fixtureLoader(specialWeaponsWorldFixture);

    await world.user1Core.initializePlayer(...makeInitArgs(SPAWN_PLANET_1));
    await world.user2Core.initializePlayer(...makeInitArgs(SPAWN_PLANET_2));
    // world.contracts.core.changeDestroyThreshold(destroyThresold);
    await increaseBlockchainTime();

  });

  it('should get player stockpile', async function () {
    expect(await world.user1Core.getPlayerStockpile(world.user1.address)).to.equal(0);
    expect(await world.user2Core.getPlayerStockpile(world.user2.address)).to.equal(0);
  });

  it('should emit an event', async function() {
    const toId = LVL1_ASTEROID_2.id;

    const dist = 100;
    const shipsSent = 90000;
    const silverSent = 0;

    await world.user1Core.move(
      ...makeMoveArgs(SPAWN_PLANET_1, LVL1_ASTEROID_2, dist, shipsSent, silverSent)
    );
    await increaseBlockchainTime();
    await world.contracts.core.refreshPlanet(toId);

    const planetSilver = Number((await world.contracts.core.planets(toId)).silver);
    console.log(planetSilver);
    expect(planetSilver).to.be.above(0);

    await expect(world.user1Core.sendToStockpile(toId, planetSilver - 1))
        .to.emit(world.contracts.core, 'sentToStockpile')
        .withArgs(world.user1.address, toId, planetSilver - 1);
  });
  it.only('sendToStockpile catches correct errors', async function () {
    const dist = 0;
    const shipsSent = 90000;
    const silverSent = 0;

    await world.user1Core.move(
      ...makeMoveArgs(SPAWN_PLANET_1, LVL1_ASTEROID_2, dist, shipsSent, silverSent)
    );
    await increaseBlockchainTime();
    const toId = LVL1_ASTEROID_2.id;
    const planet1 = SPAWN_PLANET_1.id;

    await world.contracts.core.refreshPlanet(toId);
    let finalSilver = (await world.contracts.core.planets(toId)).silver;

    await expect(world.user2Core.sendToStockpile(toId, finalSilver)).to.be.revertedWith("you must own this planet");
    await expect(world.user1Core.sendToStockpile(toId, 1000000)).to.be.revertedWith("tried to withdraw more silver than exists on planet");
    await world.user1Core.sendToStockpile(toId, finalSilver);
    await world.contracts.core.refreshPlanet(toId);
    await expect(world.user1Core.sendToStockpile(toId, finalSilver)).to.be.revertedWith("tried to withdraw more silver than exists on planet");

  })
  it('sendToStockpile works properly', async function () {
    const dist = 0;
    const shipsSent = 90000;
    const silverSent = 0;

    await world.user1Core.move(
      ...makeMoveArgs(SPAWN_PLANET_1, LVL1_ASTEROID_2, dist, shipsSent, silverSent)
    );
    await increaseBlockchainTime();
    const toId = LVL1_ASTEROID_2.id;
    const planet1 = SPAWN_PLANET_1.id;
    await world.contracts.core.refreshPlanet(toId);

    expect((await world.contracts.core.planets(toId)).population).to.be.above(0);
    expect((await world.contracts.core.planets(toId)).silver).to.be.above(0);

    await world.contracts.core.refreshPlanet(toId);

    let finalSilver = (await world.contracts.core.planets(toId)).silver;
    console.log(finalSilver);
    expect(finalSilver).to.be.above(0);
    
    await world.user1Core.sendToStockpile(toId, finalSilver);

    expect(await world.user1Core.getPlayerStockpile(world.user1.address)).to.equal(finalSilver);

    await increaseBlockchainTime(60);
    await world.contracts.core.refreshPlanet(toId);
    console.log((await world.contracts.core.planets(toId)).silver)

    expect(Number((await world.contracts.core.planets(toId)).silver)).to.be.lessThan(Number(finalSilver));
  });
});