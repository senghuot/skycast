module.exports = function backToHomePage() {
  // Get access to `req` and `res`
  // (since the arguments are up to us)
  var req = this.req;
  var res = this.res;

  // All done- either send back an empty response w/ just the status code
  // (e.g. for AJAX requests)
  if (req.wantsJSON) {
    return res.send(200);
  }
  // or redirect to the home page
  return res.redirect('/');
}
