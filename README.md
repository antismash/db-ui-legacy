antiSMASH database web UI
=========================

A web UI for the antiSMASH database.

License
-------

Under the same GNU Affero General Public License version 3 or later as antiSMASH.
See the [`LICENSE`](LICENSE) file for details.


## Installation

```
## install required packages
yarn install

## install vendor packages
# the following line is need on on OSX + homebrew
# export NODE_PATH=/usr/local/lib/node_modules

yarn global add bower
yarn add bower-npm-resolver
bower install


## run the app
yarn start


