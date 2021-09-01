import React, { useRef, useEffect, useCallback, useState } from "react";
import {useSelector, useDispatch} from "react-redux";
import { useSpring, animated } from "react-spring";
import Icon from "@mdi/react";
import {
    mdiClose,
    mdiContentCopy,
    mdiClipboardCheckMultipleOutline,
} from "@mdi/js";
import { Row, Col } from "react-bootstrap";

export default function VerifModal({ showModal, setShowModal, company, total }) {
    const modalRef = useRef();
    const animation = useSpring({
        config: {
            duration: 250,
        },
        opacity: showModal ? 1 : 0,
        transform: showModal ? `translateY(0%)` : `translateY(-100%)`,
    });

    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            setShowModal(false);
        }
    };

    const keyPress = useCallback(
        (e) => {
            if (e.key === "Escape" && showModal) {
                setShowModal(false);
            }
        },
        [setShowModal, showModal]
    );

    useEffect(() => {
        document.addEventListener("keydown", keyPress);
        return () => document.removeEventListener("keydown", keyPress);
    }, [keyPress]);
    const [copyClip, setCopyClip] = useState(true);

    const copy = () => {
        setCopyClip(!copyClip);
    };

    return (
        <div>
            {showModal ? (
                <div className="back-style" onClick={closeModal} ref={modalRef}>
                    <animated.div style={animation}>
                        <div className="modal-style" showModal={showModal}>
                            {/* <img className="modal-img" src={"/uploads/2021/07/1627022384680.jpg"} alt="camera" /> */}
                            <div className="modal-content">
                                <h4>Төлбөр төлөх заавар</h4>
                                <p>Захиалгын дүн</p>
                                <h3 style={{ fontWeight: "500" }}>{total} ₮</h3>
                                <span>Төлбөрийн нөхцөл</span>
                                <h2 style={{ color: "#ff1c73" }}>
                                    Дансаар шилжүүлэх
                                </h2>
                                <div
                                    style={{
                                        width: "100%",
                                        height: "200px",
                                        backgroundColor: "#ffedb5",
                                        // display: "flex-wrap",
                                        // justifyContent: "space-around",
                                        // alignItems: "center",
                                        textAlign: "center",
                                    }}
                                >
                                    <div style={{ margin: "30px" }}>
                                        <Row>
                                            <Col xs={6}>
                                                <p>Хүлээн авагч</p>
                                            </Col>
                                            <Col xs={4}>
                                                <span
                                                    style={{
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                   {company.accountName}
                                                </span>
                                            </Col>
                                            <Col xs={2}>
                                                <Icon
                                                    onClick={copy}
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    path={
                                                        copyClip
                                                            ? mdiContentCopy
                                                            : mdiClipboardCheckMultipleOutline
                                                    }
                                                    size={1}
                                                    color="#909090"
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={6}>
                                                <p>{company.bankName}</p>
                                            </Col>
                                            <Col xs={4}>
                                                <span
                                                    style={{
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    {company.account}
                                                </span>
                                            </Col>
                                            <Col xs={2}>
                                                <Icon
                                                    onClick={copy}
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    path={
                                                        copyClip
                                                            ? mdiContentCopy
                                                            : mdiClipboardCheckMultipleOutline
                                                    }
                                                    size={1}
                                                    color="#909090"
                                                />
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xs={6}>
                                                <p>Гүйлгээний утга</p>
                                            </Col>
                                            <Col xs={4}>
                                                <span
                                                    style={{
                                                        fontWeight: "500",
                                                        color: "##eb7d34",
                                                    }}
                                                >
                                                    R902022667
                                                </span>
                                            </Col>
                                            <Col xs={2}>
                                                <Icon
                                                    onClick={copy}
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    path={
                                                        copyClip
                                                            ? mdiContentCopy
                                                            : mdiClipboardCheckMultipleOutline
                                                    }
                                                    size={1}
                                                    color="#909090"
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div style={{ margin: "10px" }}>
                                    <span style={{ textAlign: "justify" }}>
                                        Таны захиалга төлбөр төлөгдсөний дараа
                                        баталгаажих болно! Та аль ч банкны
                                        салбар болон интернет банкны апликейшн
                                        ашиглан төлбөрөө төлөх боломжтой.
                                    </span>
                                    <br />
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            margin: "10px",
                                        }}
                                    >
                                        <span>
                                            Лавлах утас:{" "}
                                            <span style={{ fontWeight: "500" }}>
                                                {company.phone}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Icon
                                style={{
                                    cursor: "pointer",
                                    position: "absolute",
                                    top: "20px",
                                    right: "20px",
                                    width: "32px",
                                    height: "32px",
                                    padding: 0,
                                    zIndex: "10",
                                }}
                                path={mdiClose}
                                size={1}
                                onClick={() => setShowModal((prev) => !prev)}
                                color="#000"
                            />
                        </div>
                    </animated.div>
                </div>
            ) : null}
        </div>
    );
}
