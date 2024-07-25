import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import t from "../../translate/TranslateService";
import {toCamelCase} from "../../../lib/stuff";
import "./Account.css";

import { API_URL } from '../../../config';
import {clsx} from "clsx";
import {useAuthProvider, useEmailStore, useOrderStore} from "../../../store";
import {Button} from "../../../components/button";
import ChangeEmailForm from "./forms/change-email-form";
import {useToken} from "../../../lib/global/hooks";
import {useAddressesStore} from "./addresses/store";

const userName = clsx(
    'flex p-5 mx-5 border-[1px] border-black cursor-pointer',
    'hover:bg-black hover:text-white',
    'max-sm:py-2'
);

const firstBlock = clsx(
    "pb-[50px] flex items-center",
    "max-sm:flex-col",
    ""
);

const secondBlock = clsx(
    "items-center justify-items-center pb-[50px]",
    'max-sm:flex max-sm:flex-col',
    'lg:grid lg:grid-cols-2 lg:gap-x-1'
);

const divider = clsx(
    'bg-gray-300 mb-2 h-[0.0825rem]',
);

const blocksContainer = clsx(
    'flex flex-col justify-items-start h-full w-full'
);

const title = clsx(
    'tracking-widest',
);

const btn = clsx(
    'border-[1px] border-black flex items-center justify-center',
    'tracking-widest py-3 mt-2',
    'hover:bg-black hover:text-white',
    'max-sm:w-2/3',
    'md:w-2/3',
    'lg:w-1/3',
);

const orderFields = clsx(
    'flex justify-between',
    'max-sm:w-full',
    'md:w-2/3',
    'lg:w-1/3',
);

const imgContainer = clsx(
    'flex pr-1'
);

const imgSizes = clsx(
    'max-sm:h-[64px]',
    'md:h-[92px]',
    'lg:h-[128px]',
);

const Account = () => {
    const navigate = useNavigate();
    const token = useToken();
    const language = t.language();
    const { signOut } = useAuthProvider();
    const { getAddresses} = useAddressesStore();
    const [primaryAddress, lastOrder] = [
        useAddressesStore(a => a.computed.primaryAddress()),
        useOrderStore(o => o.computed.lastOrder())
    ];
    const { getOrders } = useOrderStore();
    const { email, getEmail, toggleChangeEmail, isChangeEmailFormOpened } = useEmailStore();

    const [shipTo, setShipTo] = React.useState("");
    const [for_, setFor] = React.useState("");
    const [deliveredAt, setDeliveredAt] = React.useState("");

    useEffect(() => {
        (async () => {
            if (token?.access) {
                await getOrders(token);
                await getAddresses(token);
            }
        })();

    }, []);

    useEffect(() => {
        if (lastOrder !== null && lastOrder.shipping_address !== undefined) {
            setShipTo(
                [
                    `${lastOrder.shipping_address?.province?.country?.name}, `,
                    `${lastOrder.shipping_address?.postal_code}, `,
                    `${lastOrder.shipping_address?.province?.name}, `,
                    `${lastOrder.shipping_address?.city}, `,
                    `${lastOrder.shipping_address?.address1}, `,
                    `${lastOrder.shipping_address?.address2} `
                ].join("")
            );
            setFor(lastOrder.shipping_address?.firstName + " " + lastOrder.shipping_address?.last_name);

            if (lastOrder.status === "completed") {
                setDeliveredAt(lastOrder.updated_at)
            }
        }
    }, [lastOrder]);

    useEffect(() => {
        async function f() {
            if (token?.access) {
                await getEmail(token);
            }
        }

        f();
    }, []);

    const logout = async e => {
        e.preventDefault();
        await signOut(token);
        navigate("/");
    };

    if (isChangeEmailFormOpened) {
        return <ChangeEmailForm />
    } else {
        return (
            <div className="min-h-[100vh] px-[30px]">
                <div className={firstBlock}>
                    <span>Account:</span>
                    <span className={userName} onClick={toggleChangeEmail}>{email || "..."}</span>
                    <form onSubmit={logout}>
                        <button type="submit">
                            {t.account.logout[language]}
                        </button>
                    </form>
                </div>
                <div className={secondBlock}>
                    <div className={blocksContainer}>
                        <div className="h-[330px]">
                            <div className={title}>{t.account.primaryAddress[language]}</div>
                            <div className={divider}></div>
                            <div className="">
                                {
                                    primaryAddress ? (
                                        <>
                                            <div>{primaryAddress?.first_name} {primaryAddress?.last_name}</div>
                                            <div>{primaryAddress?.address1}</div>
                                            <div>{primaryAddress?.address2}</div>
                                            <div>{primaryAddress?.postal_code}</div>
                                            <div>{primaryAddress?.city}</div>
                                            <div>{primaryAddress?.province?.name}</div>
                                            <div>{primaryAddress?.province?.country.name}</div>
                                            <div>±{primaryAddress?.phone_code?.phone_code} {primaryAddress?.phone_number}</div>
                                            <div>{primaryAddress?.email}</div>

                                        </>
                                    ) : (
                                        <div>{t.account.noAddress[language]}</div>
                                    )
                                }
                            </div>
                        </div>
                        <div className="w-1/2"><Button onClick={() => navigate('/account/details/addresses')}>
                            {t.account.seeAddresses[language]}
                        </Button></div>
                    </div>
                    <div className={blocksContainer}>
                        <div className="h-[330px]">
                            <div className={title}>{t.account.orders[language]}</div>
                            <div className={divider}></div>
                            <div className="">
                                {
                                    lastOrder?.id === undefined
                                    ? (
                                        <div>{t.account.noOrders[language]}</div>
                                    ) : (
                                        <>
                                            <div className={orderFields}>{lastOrder.order_number}</div>
                                            {
                                                lastOrder.status === "completed" ? (
                                                    <div className={orderFields}>
                                                        <span>{t.account.deliveredAt[language]}</span>
                                                        <span>{new Date(deliveredAt).toDateString()}</span>
                                                    </div>
                                                ) : (lastOrder.status === "refunded" || lastOrder.status === "partial_refunded") ? (
                                                    <>
                                                        <div className={orderFields}>
                                                            <span>{t.account.status[language]}</span>
                                                            <span>{t.account.orders.status[toCamelCase(lastOrder.status)][language]}</span>
                                                        </div>
                                                        <div className={orderFields}>
                                                            <span>{t.account.refundedAt[language]}</span>
                                                            <span>{new Date(lastOrder.updated_at).toDateString()}</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className={orderFields}>
                                                            <span>{t.account.status[language]}</span>
                                                            <span>{t.account.orders.status[toCamelCase(lastOrder.status)][language]}</span>
                                                        </div>
                                                        <div className={orderFields}>
                                                            <span>{t.account.updatedAt[language]}</span>
                                                            <span>{new Date(lastOrder.updated_at).toDateString()}</span>
                                                        </div>
                                                    </>
                                                )
                                            }
                                            <div className={imgContainer}>
                                            {Array.isArray(lastOrder?.order_item) && lastOrder.order_item.map((item, index) => (
                                                <img style={{
                                                    marginRight: "10px",
                                                    filter: lastOrder.status === "refunded" ||
                                                            lastOrder.status === "partial_refunded"
                                                        ? "brightness(0.6)" : "none",
                                                }}
                                                     src={`${API_URL}${item.item.item.image}`}
                                                     className={imgSizes}
                                                     key={index} alt={`alt-img-${index}`}/>
                                            ))}
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                        <div className="w-1/2">
                            <Button onClick={() => navigate('/account/details/orders')}>
                                {t.account.seeOrders[language]}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


};

export default Account;