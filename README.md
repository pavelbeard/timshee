The online store and showroom 'Tismhee'

This project is a fully functional online store.

<b>After start the project:</b>

<p>Don't forget in the files <b>timshee/prod.env</b>, <b>frontend/timshee/.env.production</b>,  и <b>postgres-files/prod.env</b> fill environments!</p>
<ul>
    <li>
        <p>timshee/prod.env</p>
        <ul>
            <li><b>ALLOWED_ORIGINS:</b> <p>responses for your URL</p></li>
            <li><b>DJANGO_SUPERUSER_PASSWORD:</b> <p>admin password</p></li>
            <li><b>DJANGO_SECRET_KEY:</b> <p>generate him with next command: <code>openssl rand --hex 32</code> </p></li>
            <li><b>POSTGRES_DB_PASSWORD:</b> <p>any password for your database</p></li>
            <li><b>EMAIL_PORT:</b> <p>port of your e-mail API</p></li>
            <li><b>EMAIL_HOST_USER</b> <p>username of e-mail API</p></li>
            <li><b>EMAIL_HOST_PASSWORD:</b> <p>password of e-mail API</p></li>
            <li><b>ACCOUNT_ID</b> <p>this is for russian payment system</p></li>
            <li><b>SECRET_KEY</b>   <p>and this too</p></li>
            <li><b>CLIENT_REDIRECT</b> <p>redirect url after making payment</p></li>
        </ul>
    </li>
    <li>
        <p>postgres-files/prod.env</p>
        <ul>
            <li><b>POSTGRES_PASSWORD:</b> <p>any password for your database</p></li>
        </ul>
    </li> 
    <li>
        <p>frontend/timshee/.env.production</p>
        <ul>
            <li><b>REACT_APP_API_URL:</b> <p>one must be same with env <b>ALLOWED_ORIGINS</b></p></li>
        </ul>
    </li>
    <li>
        <p>Also don't forget apply chmod to 'prod.start-project.sh'</p>
    </li>
</ul>

<p>If you want to start the projects with SSL certificates, don't forget to change these files in the next path:</p>
<code>/frontend/prod.nginx.conf</code>

<p>Start the project with script</p>
<code>
    source prod.start-project.sh
</code>