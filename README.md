# The online store and showroom 'Tismhee'

This project is a fully functional online store.

**After starting the project:**

- **ALLOWED_ORIGINS:** responses for your URL
- **DJANGO_SUPERUSER_PASSWORD:** admin password
- **DJANGO_SECRET_KEY:** generate it with next command: `openssl rand --hex 32`
- **POSTGRES_DB_PASSWORD:** any password for your database
- **EMAIL_PORT:** port of your e-mail API
- **EMAIL_HOST_USER:** username of e-mail API
- **EMAIL_HOST_PASSWORD:** password of e-mail API
- **ACCOUNT_ID:** this is for the Russian payment system
- **SECRET_KEY:** and this too
- **CLIENT_REDIRECT:** redirect URL after making payment
- **POSTGRES_PASSWORD:** any password for your database

If you want to use API MJML for rendering email templates, fill these values:

- **MJML_APP_ID:** mjml render server app ID
- **MJML_APP_KEY:** mjml render server app KEY

Otherwise, fill the value which corresponds to your own rendering server:

- **MJML_OWN_SERVER_URL:**

For load_balancer:

- **DRF_API_KEY:** one must be the same with **DJANGO_SECRET_KEY**
- For other services, you can create your own API key and put in your code to access to Django API.

Check the **.env**. This file contains secrets. 

Also remember to apply **chmod** to `prod.start-project.sh` or `prod.images.start-project.sh`

**If you want to start the projects with SSL certificates, execute these steps:**

1. Start load_balancer `docker compose -f prod.[images].docker-compose up load_balancer -d`
2. Create basic nginx config without a server with port 443. Config should be here: **./nginx/conf/nginx.conf**
3. Run this cmd: `docker exec -it timshee-load_balancer-1 nginx -s reload`
4. Test certbot with: `docker compose -f prod.[images].docker-compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ --dry-run -d [your_site].com -v`
5. If you got a success message like "The dry run was successful" run this command without **--dry-run**
6. If all is OK, you should exit from a certificate creator helper with **ctrl+c**
7. Next, you should add to nginx.conf a config for port 443
8. Reload the server with `docker exec -it timshee-load_balancer-1 nginx -s reload`

**Start the project with a script**

- For weak servers: `source prod.images.start-projects.sh`
- For strong servers: `source prod.start-project.sh`

The difference between these scripts is the way to build the project.

`prod.images.start-projects.sh` is pulling already built **containers** from docker.io

Otherwise, `prod.start-projects.sh` is **building containers** on the server and then starting them
