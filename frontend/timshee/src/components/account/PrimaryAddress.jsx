import React from "react";
import {useTranslation} from "react-i18next";
import ToButton from "../ui/ToButton";
import InfoContainer from "./InfoContainer";
import ButtonContainer from "./ButtonContainer";
import BlockContainer from "./BlockContainer";
import Divider from "./Divider";
import Title from "./Title";

export default function PrimaryAddress({ primaryAddress }) {
    const { t } = useTranslation();
    return (
        <BlockContainer  data-primary-address="">
            <InfoContainer >
                <Title>{t('account:primaryAddress')}</Title>
                <Divider />
                <section className="h-full min-h-52 flex flex-col">
                    {primaryAddress
                        ? <>
                            <span className="roboto-light">{primaryAddress?.first_name} {primaryAddress?.last_name}</span>
                            <span className="roboto-light">{primaryAddress?.address1}</span>
                            <span className="roboto-light">{primaryAddress?.address2}</span>
                            <span className="roboto-light">{primaryAddress?.postal_code}</span>
                            <span className="roboto-light">{primaryAddress?.city}</span>
                            <span className="roboto-light">{primaryAddress?.province?.name}</span>
                            <span className="roboto-light">{primaryAddress?.province?.country.name}</span>
                            <span className="roboto-light">+{primaryAddress?.phone_code?.phone_code} {primaryAddress?.phone_number}</span>
                            <span className="roboto-light">{primaryAddress?.email}</span>

                        </>
                        : <span className="roboto-light">{t('account:noAddress')}</span>
                    }
                </section>
            </InfoContainer>
            <ButtonContainer>
                <ToButton to={'/account/details/addresses'}>
                    {t('account:seeAddresses')}
                </ToButton>
            </ButtonContainer>
        </BlockContainer>
    )
}