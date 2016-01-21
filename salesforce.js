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


/**
usage:
"Select ?, ? FROM Contacts"
data structure:

{
    "Select": [
        {
            "Id": "id"
            func: function(id) {
                return parseBase64(id);
            }
        }
    ]
    "From": "Contacts",
    "Where" [
            "Id = asdfasdf"
    ]
}

return:
[
    {
        id: Base64<asdfasdf>
    }
]
**/

function sf_query(query_struct) {
    var query_str = "SELECT ", i = 0;
    var select = query_struct.Select, end = "";
    for(i = 0; i < select.length; ++i) {
        end = " "
        if (i !== select.length -1) {
            end = ", ";
        }
        query_str += Object.keys(select[i])[0] + end;
    }
    query_str += "FROM " + query_struct.From;
    if(query_struct.Where.length > 0) {
        query_str += " WHERE ";
        var where = query_struct.Where;
        for(i = 0; i < where.length; ++i) {
            query_str += where[i] + " ";
        }
    }
    console.log(query_str);
  return conn.query(query_str, function(err, res) {
    if (!err) {
        var query_obj = [];
        for(i = 0; i < res.records.length; ++i) {
            query_obj.push({});
            for(var j = 0; j < query_struct.Select.length; ++j) {
                var name = query_struct.Select[j];
                var feild = Object.keys(select[j])[0];
                var q_val = res.records[i][feild];
                if(name.func) {
                    query_obj[i][name[feild]] = name.func(q_val);
                }else {
                    query_obj[i][name[feild]] = q_val;
                }
            }
        }
        console.log(query_obj);
      return query_obj;
    }
    console.error(err);
    return err;
  });
}
