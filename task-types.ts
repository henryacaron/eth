// @ts-ignore because they don't exist before first compile
import type {
  DarkForestArtifactUtils,
  DarkForestCore,
  DarkForestGetters,
  DarkForestPlanet,
  DarkForestSpecialWeapons,
  DarkForestTokens,
  DarkForestUtils,
  Verifier,
  Whitelist,
} from '@darkforest_eth/contracts/typechain';
import type { Contract } from 'ethers';

export {
  DarkForestCore,
  DarkForestTokens,
  DarkForestGetters,
  DarkForestPlanet,
  DarkForestSpecialWeapons,
  DarkForestUtils,
  DarkForestArtifactUtils,
  Verifier,
  Whitelist,
};

export interface LibraryContracts {
  lazyUpdate: Contract;
  utils: DarkForestUtils;
  planet: DarkForestPlanet;
  specials: DarkForestSpecialWeapons,
  initialize: Contract;
  verifier: Verifier;
  artifactUtils: DarkForestArtifactUtils;
}

export interface DarkForestCoreReturn {
  blockNumber: number;
  contract: DarkForestCore;
}
