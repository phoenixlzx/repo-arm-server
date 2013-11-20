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
    pkgs = [];
    
    db.each("SELECT * FROM pkginfo WHERE forarch=$pkgarch AND pkgname=$pkgname", {
        $pkgarch: req.query.arch,
        $pkgname: req.query.pkgname
    }, function (err, row) {
        if(err) {
            return (err);
        }
        // Query success, return packages to client.
        pkgs.push(row.pkgrepo + "|" + row.pkgname + "|" + row.pkgarch + "|" + row.pkgver + "|"
                + config.downloadurl + row.pkgrepo + "/os/" + req.query.arch
                + row.filename.substr(row.filename.lastIndexOf("/")) + "|"
                + row.pkgver.substr(row.pkgver.lastIndexOf("-" - 1))
                + "\n");
        pkgs = pkgs.naturalSort().reverse();
        /*
        res.write(
            row.pkgrepo + "|" + row.pkgname + "|" + row.pkgarch + "|" + row.pkgver + "|"
                + config.downloadurl + row.pkgrepo + "/os/" + req.query.arch
                + row.filename.substr(row.filename.lastIndexOf("/")) + "|"
                + row.pkgver.substr(row.pkgver.lastIndexOf("-" - 1))
                + "\n"
        );
        */
        // TODO what if package not found? currently return nothing.
    }, function() {
        res.end(pkgs.toString().replace(/,/g, ''));
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
    db.each("SELECT * FROM pkginfo WHERE forarch=$pkgarch AND pkgname=$pkgname ORDER BY ABS(pkgver) DSC;", {
        $pkgarch: pkgarch,
        $pkgname: pkgname
    }, function (err, row) {
        if(err) {
            return (err);
        }
        // Query success, return packages to client.
        pkgs.push(row.pkgrepo + "|" + row.pkgname + "|" + row.pkgarch + "|" + row.pkgver + "|"
                + config.downloadurl + row.pkgrepo + "/os/" + req.query.arch
                + row.filename.substr(row.filename.lastIndexOf("/")) + "|"
                + row.pkgver.substr(row.pkgver.lastIndexOf("-" - 1))
                + "\n");
        pkgs = pkgs.naturalSort().reverse();
        /*
        res.write(
            row.pkgrepo + "|" + row.pkgname + "|" + row.pkgarch + "|" + row.pkgver + "|"
                + config.downloadurl + row.pkgrepo + "/os/" + pkgarch
                + row.filename.substr(row.filename.lastIndexOf("/")) + "|"
                + row.pkgver.substr(row.pkgver.lastIndexOf("-" - 1))
                + "\n"
        );
        */
    }, function() {
        res.end(pkgs.toString().replace(/,/g, ''));
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

    db.each("SELECT * FROM pkginfo WHERE forarch=$pkgarch AND pkgname LIKE $pkgname ORDER BY ABS(pkgver) DSC;", {
        $pkgarch: pkgarch,
        $pkgname: pkgname + "%"
    }, function (err, row) {
        if(err) {
            return (err);
        }
        // Query success, return packages to client.
        pkgs.push(row.pkgrepo + "|" + row.pkgname + "|" + row.pkgarch + "|" + row.pkgver + "|"
                + config.downloadurl + row.pkgrepo + "/os/" + req.query.arch
                + row.filename.substr(row.filename.lastIndexOf("/")) + "|"
                + row.pkgver.substr(row.pkgver.lastIndexOf("-" - 1))
                + "\n");
        pkgs = pkgs.naturalSort().reverse();
        /*
        res.write(
            row.pkgrepo + "|" + row.pkgname + "|" + row.pkgarch + "|" + row.pkgver + "|"
                + config.downloadurl + row.pkgrepo + "/os/" + pkgarch
                + row.filename.substr(row.filename.lastIndexOf("/")) + "|"
                + row.pkgver.substr(row.pkgver.lastIndexOf("-" - 1))
                + "\n"
        );
        */
    }, function() {
        res.end(pkgs.toString().replace(/,/g, ''));
    });
};

// Natural sort function from 
// http://stackoverflow.com/questions/4373018/sort-array-of-numeric-alphabetical-elements-natural-sort
Array.prototype.naturalSort= function(){
    var a, b, a1, b1, rx=/(\d+)|(\D+)/g, rd=/\d+/;
    return this.sort(function(as, bs){
        a= String(as).toLowerCase().match(rx);
        b= String(bs).toLowerCase().match(rx);
        while(a.length && b.length){
            a1= a.shift();
            b1= b.shift();
            if(rd.test(a1) || rd.test(b1)){
                if(!rd.test(a1)) return 1;
                if(!rd.test(b1)) return -1;
                if(a1!= b1) return a1-b1;
            }
            else if(a1!= b1) return a1> b1? 1: -1;
        }
        return a.length- b.length;
    });
}