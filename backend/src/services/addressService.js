const Address = require('../models/Address');
const ApiError = require('../utils/ApiError');

async function listAddresses(userId) {
  return Address.find({ user: userId }).sort('-isDefault -createdAt');
}

async function clearOtherDefaults(userId, exceptId) {
  await Address.updateMany({ user: userId, _id: { $ne: exceptId } }, { isDefault: false });
}

async function createAddress(userId, data) {
  const address = await Address.create({ ...data, user: userId });
  if (address.isDefault) {
    await clearOtherDefaults(userId, address._id);
  }
  return address;
}

async function updateAddress(userId, addressId, data) {
  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) throw ApiError.notFound('Address not found');

  Object.assign(address, data);
  await address.save();

  if (address.isDefault) {
    await clearOtherDefaults(userId, address._id);
  }

  return address;
}

async function deleteAddress(userId, addressId) {
  const address = await Address.findOneAndDelete({ _id: addressId, user: userId });
  if (!address) throw ApiError.notFound('Address not found');
}

module.exports = { listAddresses, createAddress, updateAddress, deleteAddress };
