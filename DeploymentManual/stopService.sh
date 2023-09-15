#!/bin/sh
PID1=`netstat -tlnp 2>&1 | awk '/:3000 */ {split($NF,a,"/"); print a[1]}'`
echo $PID1
kill -9 $PID1
PID2=`netstat -tlnp 2>&1 | awk '/:3306 */ {split($NF,a,"/"); print a[1]}'`
echo $PID2
kill -9 $PID2


