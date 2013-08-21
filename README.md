##A.R.M - Arch Rollback Machine
Server scripts

###Usage

1. Install Node.js

2. `git clone https://github.com/phoenixlzx/repo-arm-server && cd repo-arm-server && npm install && mkdir -p packages`

3. Sync your packages in `public/packages` directory.

4. `node app.js`

This application reads the `./pkginfo.db` file created by lilydjwg's [archrepo2](https://geakit.com/lilydjwg/archrepo2), which will 
include all packages info under a directory.

###TODO

* Add `repo` field to pkginfo.db so this app will read and return it to downgrade client.

* A basic webpage that could search package directly.
