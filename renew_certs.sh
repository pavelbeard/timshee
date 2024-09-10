#!/bin/bash
docker run -it --rm -v /home/timshee/certbot:/etc/letsencrypt certbot/certbot renew
cp -R /home/timshee/certbot/archive/timshee.ru /home/timshee/timshee-certs

chown -R timshee:timshee /home/timshee/timshee-certs
chmod -R 755 /home/timshee/timshee-certs
cert_files=(cert1.pem chain1.pem  fullchain1.pem  privkey1.pem)

for cert_file in "${cert_files[@]}"; do
  newfilename="${cert_file//1/}"
  mv ${cert_file} ${newfilename}
done
