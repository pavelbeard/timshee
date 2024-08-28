import {Body, Font, Head, Html, Img, Tailwind} from "@react-email/components";

export default function OrderStatus({
    orderText,
    yourItems,
    orderNumber,
    orderItems,
    refundReason
}) {
    const src = orderText ? "-IMAGE_SRC-" : `/static/logo.png`
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
                <Body className="flex pt-3 flex-col w-full">
                    <div className="flex pt-3 flex-col items-center justify-center">
                        <Img
                            src={src}
                            height={40}
                            width={141}
                            alt="timshee-logo"
                        />
                    </div>
                    <div className="flex flex-col bg-gray-100 mt-6 py-6 pl-6">
                        <span className="py-2">
                            {orderText || `Your order ${orderNumber || 'XCV1234567890'} is in status: Proccessing`}
                        </span>
                        {refundReason && <span className="py-2">
                            {refundReason}
                        </span>}
                        {orderItems && <>
                            <span className="py-2">
                                {yourItems || 'Your items:'}
                            </span>
                            <div className="flex flex-col">
                                {orderItems}
                            </div>
                        </>}
                    </div>
                </Body>
            </Html>
        </Tailwind>
    )
}