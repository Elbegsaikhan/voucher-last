import React, { useRef, useEffect, useCallback, useState } from "react";
import { useSpring, animated } from "react-spring";
import {isMobile} from "react-device-detect";

export default function AdsModal({ showModal, setShowModal, config }) {
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
                <div className="back-style" onClick={closeModal} ref={modalRef} style={{position: 'fixed', backgroundColor: `rgb(44, 48, 45, 0.8611)`}}>
                    <animated.div style={animation}>
                        <div className="modal-style" showModal={showModal}>
                            <div className="modal-content">
                                <img src={config.homeBanner1} width="600px" style={{ backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}} />
                            </div>
                        </div>
                    </animated.div>
                </div>
            ) : null}
        </div>
    );
}
