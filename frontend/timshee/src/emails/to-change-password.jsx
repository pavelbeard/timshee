import {Body, Button, Font, Head, Heading, Html, Img, Link, Tailwind} from "@react-email/components";

export default function ToChangePassword(props) {
    const { link, h2, text, linkLabel } = props;
    const src = link ? "-IMAGE_SRC-" : `/static/logo.png`
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
                    <div className="flex pt-3 flex-col w-full">
                        <div className="flex justify-center">
                            <Img
                                src={src}
                                height={40}
                                width={141}
                                alt="timshee-logo"
                            />
                        </div>
                        <div className="bg-gray-100 mt-6 py-6 pl-6">
                            <h2>{h2}</h2>
                            <div>
                                <p>{text?.p1}</p>
                                <Link href={link}>{linkLabel}</Link>
                                <p>{text?.p2}</p>
                            </div>
                        </div>
                    </div>
                </Body>
            </Html>
        </Tailwind>
    )
}