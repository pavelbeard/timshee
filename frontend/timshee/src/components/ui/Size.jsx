import React from "react";

export default function Size(props) {
    return (
        <div
            key={props?.index ? props.index * 3 : 0}
            className="ml-0.5"
        >
            {props.value}
        </div>
    )
}
