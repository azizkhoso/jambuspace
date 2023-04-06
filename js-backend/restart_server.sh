
#!/bin/bash

git pull
# restart postback api
cat ~/space/info.log >> ~/space/full-info.log
cat ~/space/error.log >> ~/space/full-error.log
sudo forever stop ~/space/index.js
sudo forever start -o ~/space/info.log -e ~/space/error.log ~/space/index.js
