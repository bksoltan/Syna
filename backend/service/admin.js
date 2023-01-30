const { UserModel } = require("../models/User");
const { SubscriptionModel } = require("../models/Subscription");
const ethers = require("ethers");

require("dotenv").config();

const { PRIVATE_KEY, NETWORK, ALCHEMY_KEY, CONTRACT_ADDR } = process.env;

const abi = [
  "function setPointFactor(uint256 newFactor) public",
  "function addPoint(address user, uint256 earnedPoint) public",
  "function getPointFactor() public view returns(uint256)",
  "function getPoint() public view returns(uint256)",
];

// Helper method for fetching a connection provider to the Ethereum network
function getProvider() {
  if (NETWORK == "ganache") {
    const url = "http://127.0.0.1:8545"; // URL for Ganache
    return new ethers.providers.JsonRpcProvider(url);
  } else {
    return ethers.getDefaultProvider(NETWORK, { alchemy: ALCHEMY_KEY });
  }
}

const reportSubscription = async (data) => {
  const { full_name, man, phone, email, earned_points } = data;
  const address = man;
  console.log(`Submit questionary result: ${man}: ${earned_points}`);
  await SubscriptionModel.create({
    full_name,
    address,
    phone,
    email,
    earned_points,
  });

  const user = await UserModel.findOne({ address });

  if (!user) {
    await UserModel.create({ address, point: earned_points });
  } else {
    user.point += earned_points;
    await user.save();
  }

  // save to blockchain
  const provider = getProvider();
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const nakamonsta = new ethers.Contract(CONTRACT_ADDR, abi, wallet);
  const tx = await nakamonsta.addPoint(address, earned_points);
  await tx.wait();
  console.log(`Tx hash: ${tx.hash}`);

  return { msg: "Success" };
};

module.exports = { reportSubscription };
