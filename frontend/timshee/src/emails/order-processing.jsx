import {Body, Button, Font, Head, Heading, Html, Img, Tailwind} from "@react-email/components";

export default function OrderProcessing() {
    return (
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
                <Body>
                    <div className="flex pt-3 flex-col items-center justify-center">
                        <Img
                            src={`/static/logo.png`}
                            height={40}
                            width={141}
                            alt="timshee-logo"
                        />
                    </div>
                </Body>
            </Html>
        </Tailwind>
    )
}