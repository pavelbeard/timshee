import t from "../../../../translate/TranslateService";
import {toCamelCase} from "../../../../api/stuff";
import {API_URL} from "../../../../../config";
import {Link} from "react-router-dom";
import React from "react";

export default function ReturnedItem({ order, language }) {
    return (
        order?.returned_item?.map((item, index) => (
            <div key={index}>
                <img height={180}
                     style={{
                         padding: "10px",
                         filter: item?.refund_reason && "brightness(60%)",
                     }}
                     src={`${API_URL}${item.item.item.image}`}
                     alt={`alt-image-${index}`}/>
                <div className="order-detail-item-info">
                    <span>{item.item.item.name}</span>
                    <span>{item.item.item.price}
                        <span>{t.shop.price[language]}</span>
                </span>
                </div>
                <div className="order-detail-item-info">
                    <span>{item.item.size.value}</span>
                </div>
                <div className="order-detail-item-info">
                    <span>{item.item.color.name}</span>
                </div>
                <div className="order-detail-item-info">
                    {item.quantity > 0 && <>
                        <span>{item.quantity}</span>
                    </>}
                </div>
                <div className="order-detail-item-info">
                    <span>Возвращено</span>
                </div>
            </div>
        ))
    )
}