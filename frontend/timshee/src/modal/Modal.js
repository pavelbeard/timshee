import React from 'react'

const modal = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const modalMain = {
    background: "#fff",
    padding: "2rem",
    borderRadius: "5px",
};

const displayBlock = {
    display: 'block',
};

const displayNone = {
    display: 'none',
}



const Modal = ({ show, handleClose, children }) => {
    const visibleState = show ? `${modal} ${displayBlock}` : `${modal} ${displayNone}`;
    
    return(
        <div className={visibleState}>
            <section className={modalMain}>
                {children}
                <button onClick={() => handleClose(false)}>X</button>
            </section>
        </div>
    )
};

export default Modal;