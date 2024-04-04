Интернет-магазин и ShowRoom "TIMSHEE"

<b>Перед запуском:</b>

<p>НЕ ЗАБУДЬ В ФАЙЛАХ <b>timshee/prod.env</b> и <b>postgres-files/prod.env</b> заполнить перменные окружения</p>
<ul>
    <li>
        <p>timshee/prod.env</p>
        <ul>
            <li>DJANGO_SUPERUSER_PASSWORD</li>
            <li>SECRET_KEY</li>
            <li>SOCIAL_AUTH_GOOGLE_OAUTH2_KEY</li>
            <li>SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET</li>
            <li>POSTGRES_DB_PASSWORD</li>
        </ul>
    </li>
    <li>
        <p>postgres-files/prod.env</p>
        <ul>
            <li>POSTGRES_PASSWORD</li>
        </ul>
    </li>
</ul>

<p>Запуск с помощью команды:</p>
<code>
    docker compose up --build -d 
</code>