##A.R.M - Arch Rollback Machine
Server scripts

###Usage

1. Install Node.js

2. `git clone https://github.com/phoenixlzx/repo-arm-server && cd repo-arm-server && npm install && mkdir -p packages`

3. Sync your packages in `public/packages` directory.

4. `node app.js`

This application reads the `./pkginfo.db` file created by lilydjwg's [archrepo2](https://geakit.com/lilydjwg/archrepo2), which will 
include all packages info under a directory.

###Downgrade

For downgrade scripts, use the search pattern:
`/search?arch=$arch&pkgname=$pkgname`
where `arch` can be either `i686` or `x86_64`, and `$pkgname` is _exactly_ the package name(`any` packages will be automatically added 
to results).

Server will return results like:
`pkgname|arch|pkgver|download-link`
(if there are multiple versions, it will display as multiple lines.)

For example:
Query url: `/search?arch=x86_64&pkgname=linux-uksm`
Will get:
```bash
linux-uksm|x86_64|3.10.7-1|http://repo-arm.archlinuxcn.org/packages/linux-uksm-3.10.7-1-x86_64.pkg.tar.xz
linux-uksm|x86_64|3.10.8-1|http://repo-arm.archlinuxcn.org/packages/linux-uksm-3.10.8-1-x86_64.pkg.tar.xz
linux-uksm|x86_64|3.10.9-1|http://repo-arm.archlinuxcn.org/packages/linux-uksm-3.10.9-1-x86_64.pkg.tar.xz
```
Currently if no package found, server will simply return nothing, package repository will be added to the result and download link 
later.

###TODO

* Add `repo` field to pkginfo.db so this app will read and return it to downgrade client.

* A basic webpage that could search package directly.
