import {Body, Font, Head, Html, Img, Tailwind, Link} from "@react-email/components";

export default function ConfirmEmail({ token, text, text2 }) {
    const src = token ? "-IMAGE_SRC-" : `/static/logo.png`
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
                <Body className="flex pt-3 flex-col w-full">
                    <div className="flex justify-center items-center">
                        <Img
                            src={src}
                            height={40}
                            width={141}
                            alt="timshee-logo"
                        />
                    </div>
                    <div className="flex bg-gray-100 mt-6 py-6 pl-6 justify-start ">
                        <div className="py-2">
                            {<p>{text2 || 'Filler email '}</p>}
                            <Link href={`-SITE_URL-account/confirm-email?token=${token}`}>
                                {text || 'Filler link'}
                            </Link>
                        </div>
                    </div>
                </Body>
            </Html>
        </Tailwind>
    )
}