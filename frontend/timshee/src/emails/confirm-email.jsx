import {Body, Font, Head, Html, Img, Tailwind, Link} from "@react-email/components";

export default function ConfirmEmail(props) {
    const { email } = props;
    const src = email ? "-IMAGE_SRC-" : `/static/logo.png`
    return(
        <Tailwind>
            <Html>
                <Head>
                    <Font
                        fontFamily='Bebas Neue'
                        fallbackFontFamily='sans-serif'
                        webFont={{
                            url: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
                            format: 'woff2'
                        }}
                        fontWeight='400'
                        fontStyle='normal'
                    />
                </Head>
                <Body className="text-2xl">
                    <div className="flex justify-center items-center">
                        <Img
                            src={src}
                            height={40}
                            width={141}
                            alt="timshee-logo"
                        />
                    </div>
                    <div className="flex justify-start">
                        <div className="p-6">
                            <Link href={`-SITE_URL-account/confirm-email?email=${encodeURIComponent(email)}`}>Email confirming</Link>
                        </div>
                    </div>
                </Body>
            </Html>
        </Tailwind>
    )
}