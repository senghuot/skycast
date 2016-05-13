module.exports = function emailAddressInUse() {
  return this.res.send(409, 'Email address is already taken by another user.');
}
