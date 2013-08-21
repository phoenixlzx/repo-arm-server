var sqlite3 = require('sqlite3').verbose(),
    config = require('../config');

exports.index = function(req, res){
  res.end('Welcome to A.R.M - Arch Rollback Machine.');
};

exports.search = function (req, res) {
    // res.send('Welcome to A.R.M - Arch Rollback Machine.'); // Need to be expand later.
    // downgrade search pattern: /?a=$arch&q=%5E$term%24$repos
    // May use our own simpler pattern: /search?arch=$arch&pkgname=$pkgname
    var db = new sqlite3.Database(config.pkginfopath + '/pkginfo.db', sqlite3.OPEN_READONLY, function (err) {
        if (err) return res.end(err);
    });

//    var query = 'SELECT * FROM pkginfo WHERE pkgarch="' + req.query.arch
//        + '" AND pkgname="' + req.query.pkgname + '";';

    // console.log(query);
    db.each("SELECT * FROM pkginfo WHERE pkgarch IN ($pkgarch, 'any') AND pkgname=$pkgname", {
        $pkgarch: req.query.arch,
        $pkgname: req.query.pkgname
    }, function (err, row) {
        if(err) {
            return (err);
        }
        // console.log(row);
        // Query success, return packages to client.
        res.write(
            row.pkgrepo + "|" + row.pkgname + "|" + row.pkgarch + "|" + row.pkgver + "|"
                + config.downloadurl + row.pkgrepo + "/os/" + row.pkgarch
                + row.filename.substr(row.filename.lastIndexOf("/")) + "\n"
        );
        // TODO what if package not found? currently return nothing.
    }, function() {
        res.end();
    });
};