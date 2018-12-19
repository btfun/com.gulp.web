# cat /data/src/delstart.sh
#!/bin/sh




NODE_USER=mljia pm2 delete bin/www
NODE_USER=mljia pm2 start bin/www -i 2
