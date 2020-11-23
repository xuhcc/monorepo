import { ethers } from 'hardhat'

import { deployMaciFactory } from '../utils/deployment'

async function main() {
  const [deployer] = await ethers.getSigners();
  const maciFactory = await deployMaciFactory(deployer);
  const SimpleUserRegistry = await ethers.getContractFactory(
    'SimpleUserRegistry',
    deployer,
  )
  const verifiedUserRegistry = await SimpleUserRegistry.deploy()
  const SimpleRecipientRegistry = await ethers.getContractFactory(
    'SimpleRecipientRegistry',
    deployer,
  )
  const recipientRegistry = await SimpleRecipientRegistry.deploy()
  await recipientRegistry.setController()
  await recipientRegistry.setMaxRecipients(24)

  const FundingRoundFactory = await ethers.getContractFactory(
    'FundingRoundFactory',
    deployer,
  );
  const fundingRoundFactory = await FundingRoundFactory.deploy(
    maciFactory.address,
    verifiedUserRegistry.address,
    recipientRegistry.address,
  );
  await fundingRoundFactory.deployed();
  await maciFactory.transferOwnership(fundingRoundFactory.address);

  console.log(`Factory deployed: ${fundingRoundFactory.address}`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
