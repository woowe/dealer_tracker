var jsforce = require('jsforce');
var co = require('co');
var conn = new jsforce.Connection();

function sf_login(username, password, sk) {
  return conn.login(username, password + sk, function(err, res) {
    console.log("Logged in");
    if (!err) {
      return res;
    }
    console.error(err);
    return err;
  });
}

function sf_query(query) {
  return conn.query(query, function(err, res) {
    if (!err) {
      return res;
    }
    console.error(err);
    return err;
  });
}
