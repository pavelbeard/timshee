The online store and showroom 'Tismhee'

This project is a fully functional online store.

<b>After start the project:</b>

<p>Don't forget in the file <b>.env and .env.production</b> fill environments!</p>
<ul>
    <li><b>ALLOWED_ORIGINS:</b> <p>responses for your URL</p></li>
    <li><b>DJANGO_SUPERUSER_PASSWORD:</b> <p>admin password</p></li>
    <li><b>DJANGO_SECRET_KEY:</b> <p>generate it with next command: <code>openssl rand --hex 32</code> </p></li>
    <li><b>POSTGRES_DB_PASSWORD:</b> <p>any password for your database</p></li>
    <li><b>EMAIL_PORT:</b> <p>port of your e-mail API</p></li>
    <li><b>EMAIL_HOST_USER</b> <p>username of e-mail API</p></li>
    <li><b>EMAIL_HOST_PASSWORD:</b> <p>password of e-mail API</p></li>
    <li><b>ACCOUNT_ID</b> <p>this is for russian payment system</p></li>
    <li><b>SECRET_KEY</b>   <p>and this too</p></li>
    <li><b>CLIENT_REDIRECT</b> <p>redirect url after making payment</p></li>
    <li><b>POSTGRES_PASSWORD:</b> <p>any password for your database</p></li>
    <li>
        <p>If you want to use API MJML for rendering email templates, fill these values:</p>
        <ul>
            <li><b>MJML_APP_ID: </b> <p>mjml render server app ID</p></li>
            <li><b>MJML_APP_KEY: </b> <p>mjml render server app KEY</p></li>
        </ul>
        <p>Otherwise, fill value, which corresponding to your own rendering server</p>
        <ul>
            <li><b>MJML_OWN_SERVER_URL: </b> <p></p></li>
        </ul>
    </li>
    <li>
        <p>frontend/timshee/.env.production</p>
        <ul>
            <li><b>REACT_APP_API_URL:</b> <p>one must be same with env <b>ALLOWED_ORIGINS</b></p></li>
        </ul>
    </li>
    <li>
        <p>Also don't forget apply <b>chmod</b> to <code>prod.start-project.sh or prod.images.start-project.sh</code></p>
    </li>
</ul>

<p>If you want to start the projects with SSL certificates, don't forget to change these files in the next path:</p>
<code>/frontend/prod.nginx.conf</code>

<p>Start the project with script</p>
<ul>
    <li>for weak servers: <code>source prod.images.start-projects.sh</code></li>
    <li>for strong servers: <code>source prod.start-project.sh</code></li>
</ul>
<p>The difference between these scripts is a way to build the project.</p>
<p><code>prod.images.start-projects.sh</code> is pulling already built <b>containers</b> from docker.io</p>
<p>otherwise <code>prod.start-projects.sh</code> is <b>building containers</b> on the server and then start them</p>