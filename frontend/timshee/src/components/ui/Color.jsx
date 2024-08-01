import React from "react";

export default function Color(props) {
    return (
        <div
            key={props?.index ? props.index * 2 : 0}
            style={{
                backgroundColor: props.hex,
            }}
            className="w-3 h-3 mr-0.5"
        >
        </div>
    )
}