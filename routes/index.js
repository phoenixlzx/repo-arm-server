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
    // console.log(req.query.arch);
    // console.log(req.query.pkgname);
    db.each("SELECT * FROM pkginfo WHERE forarch=$pkgarch AND pkgname=$pkgname", {
        $pkgarch: req.query.arch,
        $pkgname: req.query.pkgname
    }, function (err, row) {
        if(err) {
            return (err);
        }
        // Query success, return packages to client.
        res.write(
            row.pkgrepo + "|" + row.pkgname + "|" + row.pkgarch + "|" + row.pkgver + "|"
                + config.downloadurl + row.pkgrepo + "/os/" + req.query.arch
                + row.filename.substr(row.filename.lastIndexOf("/")) + "|"
                + row.pkgver.substr(row.pkgver.lastIndexOf("-" - 1))
                + "\n"
        );
        // TODO what if package not found? currently return nothing.
    }, function() {
        res.end();
    });
};

// TODO Duplicated code, improvement needed.

exports.searchapi = function (req, res) {
    var db = new sqlite3.Database(config.pkginfopath + '/pkginfo.db', sqlite3.OPEN_READONLY, function (err) {
        if (err) return res.end(err);
    });

    // Get POST data
    var pkgarch = req.body.arch,
        pkgname = req.body.pkgname;
    // console.log(pkgarch);
    // console.log(pkgname);

    // console.log(query);
    db.each("SELECT * FROM pkginfo WHERE forarch=$pkgarch AND pkgname=$pkgname", {
        $pkgarch: pkgarch,
        $pkgname: pkgname
    }, function (err, row) {
        if(err) {
            return (err);
        }
        // Query success, return packages to client.
        res.write(
            row.pkgrepo + "|" + row.pkgname + "|" + row.pkgarch + "|" + row.pkgver + "|"
                + config.downloadurl + row.pkgrepo + "/os/" + pkgarch
                + row.filename.substr(row.filename.lastIndexOf("/")) + "|"
                + row.pkgver.substr(row.pkgver.lastIndexOf("-" - 1))
                + "\n"
        );
    }, function() {
        res.end();
    });
};

exports.findapi = function (req, res) {
    var db = new sqlite3.Database(config.pkginfopath + '/pkginfo.db', sqlite3.OPEN_READONLY, function (err) {
        if (err) return res.end(err);
    });

    // Get POST data
    var pkgarch = req.body.arch,
        pkgname = req.body.pkgname;
    // console.log(pkgarch);
    // console.log(pkgname);

    db.each("SELECT * FROM pkginfo WHERE forarch=$pkgarch AND pkgname LIKE $pkgname", {
        $pkgarch: pkgarch,
        $pkgname: pkgname + "%"
    }, function (err, row) {
        if(err) {
            return (err);
        }
        // Query success, return packages to client.
        res.write(
            row.pkgrepo + "|" + row.pkgname + "|" + row.pkgarch + "|" + row.pkgver + "|"
                + config.downloadurl + row.pkgrepo + "/os/" + pkgarch
                + row.filename.substr(row.filename.lastIndexOf("/")) + "|"
                + row.pkgver.substr(row.pkgver.lastIndexOf("-" - 1))
                + "\n"
        );
    }, function() {
        res.end();
    });
};