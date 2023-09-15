#!/bin/sh
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000 
sudo ssh -N -L 3306:localhost:3306 ubuntu@54.177.73.103 -i /home/ubuntu/csc648-02-sp22-team02/credentials/CSC648DevKey.pem >/dev/null 2>&1 & 
cd /home/ubuntu/csc648-02-sp22-team02/application/backend
npm start >/dev/null 2>&1 & 
cd -
