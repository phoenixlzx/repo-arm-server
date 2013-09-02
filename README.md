## A.R.M - Arch Rollback Machine
Server scripts

### Usage

1. Install Node.js

2. `git clone https://github.com/phoenixlzx/repo-arm-server && cd repo-arm-server && npm install`

3. Sync your packages, and generate pkginfo.db using lilydjwg's [archrepo2](https://github.com/lilydjwg/archrepo2).

4. Edit `config.js.example` and rename to `config.js`

5. `node app.js`

This application reads the `pkginfo.db` file, which will include all packages info under a directory.

#### Configuration

##### Nginx 
Nginx is strongly recommended for handle HTTP requests. `repo-arm.nginx.conf.example` is for reverse proxy to A.R.M server app, and `repo-arm-download.nginx.conf.example` is for static file download service. Edit and use them for your environment.

##### config.js
`pkginfopath`: is where `pkginfo.db` file stores.

`downloadurl`: URL for downloading packages, We use Nginx to handle the download service directly, so it can be different with A.R.M site url.

### Downgrade

For downgrade scripts, use the following search pattern:
`/search?arch=$arch&pkgname=$pkgname`
where `arch` can be either `i686` or `x86_64`, and `$pkgname` is _exactly_ the package name(packages under `any` will be automatically added to results).

Server will return results like:
`pkgrepo|pkgname|arch|pkgver|downloadurl|pkgrelease`. Note: if there are multiple versions, it will display as multiple lines.

For example:
query url: `/search?arch=x86_64&pkgname=linux`
will get:
```bash
core|linux|x86_64|3.9.8-1|http://repo-arm-download.example.com/core/os/x86_64/linux-3.9.8-1-x86_64.pkg.tar.xz|1
core|linux|x86_64|3.9.9-2|http://repo-arm-download.example.com/core/os/x86_64/linux-3.9.9-1-x86_64.pkg.tar.xz|2
core|linux|x86_64|3.10.1-1|http://repo-arm-download.example.com/core/os/x86_64/linux-3.10.1-1-x86_64.pkg.tar.xz|1
```
Currently if no package found, server will simply return nothing.

**Note**

Special symbol like `+` should be encoded to `%2B`, or it will be trimmed and wont return the correct result.

### TODO

* Add `repo` field to pkginfo.db so this app will read and return it to downgrade client. [DONE]

* A basic webpage that could search package directly.
