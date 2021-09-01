import React from "react";
import Icon from "@mdi/react";
import {
    mdiMapMarker,
    mdiPhone,
} from "@mdi/js";

export default function Address(props) {
    return (
        <div style={{ margin: "5px" }}>
            <div className="" style={{ border: "thin solid #909090" }}>
                <ul style={{ margin: "10px" }}>
                    <li style={{ padding: "5px 5px", fontSize: "14px" }}>
                        <span style={{ fontWeight: "500" }}>{props.name}</span>
                    </li>
                    <li style={{ padding: "5px 5px", fontSize: "14px" }}>
                        <span>
                            <Icon path={mdiPhone} size={1} color="#909090" />
                            {props.phone}
                        </span>
                    </li>
                    <li style={{ padding: "5px 5px", fontSize: "14px" }}>
                        <span>
                            <Icon
                                path={mdiMapMarker}
                                size={1}
                                color="#909090"
                            />
                            {props.addre}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
