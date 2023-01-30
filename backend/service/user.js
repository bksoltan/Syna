const { UserModel } = require("../models/User");
const ethers = require("ethers");
const { keccak256 } = require("ethers/lib/utils");

require("dotenv").config();
const { PRIVATE_KEY } = process.env;

const getPoint = async (address) => {
  console.log(`Get point ${address}`);
  const user = await UserModel.findOne({ address });

  return { address, point: user?.point || 0 };
};

const getSignature = async (payload) => {
  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const hash = keccak256(payload);
  const hashBytes = ethers.utils.arrayify(hash);
  let flatSig = await wallet.signMessage(hashBytes);
  let sig = ethers.utils.splitSignature(flatSig);
  return sig;
};

const paddedBuffer = (data) => {
  return Buffer.concat([Buffer.alloc(32 - data.length), data]);
};

const usePoint4Mate = async (data) => {
  let { address, father, mother, point } = data;
  console.log(`Mate: ${address} (${mother}, ${father}) -> ${point}`);

  const user = await UserModel.findOne({ address });

  if (!user || user.point < point) throw "Insufficient points";
  user.point -= point;

  await user.save();

  point = ethers.utils.parseEther(point.toString());

  const payload = Buffer.concat([
    Buffer.from(address.substring(2)),
    Buffer.from(father.toString(16)),
    Buffer.from(mother.toString(16)),
    Buffer.from(point.toBigInt().toString(16)),
  ]);

  const { r, s, v } = await getSignature(payload);

  return { r, s, v, point: point.toString() };
};

const usePoint4Auction = async (data) => {
  let { address, token_id, point } = data;
  console.log(`Auction: ${address} ${token_id} -> ${point}`);
  const user = await UserModel.findOne({ address });
  if (!user || user.point < point) throw "Insufficient points";
  user.point -= point;
  await user.save();

  point = ethers.utils.parseEther(point.toString());

  const payload = Buffer.concat([
    Buffer.from(address.substring(2), "hex"),
    paddedBuffer(Buffer.from(token_id.toString(16), "hex")),
    paddedBuffer(Buffer.from(point.toHexString().substring(2), "hex")),
  ]);

  console.log(payload.toString("hex"));
  const signature = await getSignature(payload);

  return { ...signature, point: point.toString() };
};

module.exports = { getPoint, usePoint4Mate, usePoint4Auction };
