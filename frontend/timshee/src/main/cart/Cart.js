import React, {useEffect} from 'react';
import {useSelector} from "react-redux";

const Cart = () => {
    const isAuthenticated = useSelector(state => state.auth.isValid);

    useEffect(() => {

    }, [isAuthenticated]);

    return(
        <div>
            Cart
        </div>
    )
};

export default Cart;