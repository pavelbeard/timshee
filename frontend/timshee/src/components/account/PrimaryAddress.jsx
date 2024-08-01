import Button from "../ui/Button";
import React from "react";
import {useAccountContext} from "../../lib/hooks";
import {clsx} from "clsx";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import ToButton from "../ui/ToButton";

export default function PrimaryAddress() {
    const { primaryAddress } = useAccountContext();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const divider = clsx(
        'bg-gray-300 mb-2 h-[0.0825rem]',
    );
    const blocksContainer = clsx(
        'flex flex-col justify-items-start h-full w-full',
        'max-sm:pb-2',
        'sm:pb-2'
    );
    const title = clsx(
        'tracking-widest',
    );
    return (
        <div className={blocksContainer} data-primary-address="">
            <div className="h-60 mb-4">
                <div className={clsx(title, 'roboto-medium')}>{t('account:primaryAddress')}</div>
                <div className={divider}></div>
                <div className="flex flex-col">
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
                </div>
            </div>
            <div className="w-1/2">
                <ToButton to={'/account/details/addresses'}>
                    {t('account:seeAddresses')}
                </ToButton>
            </div>
        </div>
    )
}