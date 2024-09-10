import Container from "../components/ui/Container";
import {useTranslation} from "react-i18next";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import {selectConfirmationUrl} from "../redux/features/store/paymentSlice";

export default function Redirect() {
    const url = useSelector(selectConfirmationUrl);
    const { t } = useTranslation();
    useEffect(() => {
        if (url) window.location.href = url;
    }, [url])
    return (
        <Container>
            <div className="flex justify-center items-center mt-20">
                <h1 className="text-2xl">{t('stuff:redirecting')}</h1>
            </div>
        </Container>
    );
}