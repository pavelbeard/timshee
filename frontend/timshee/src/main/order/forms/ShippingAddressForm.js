import React from "react";

const ShippingAddressForm = ({ shippingAddress }) => {
    const [errorMessage, setErrorMessage] = React.useState("");

    const [country, setCountry] = React.useState();
    
    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return(
        <form onSubmit={handleSubmit} className="shipping-address-form">
            <span className="shipping-address">Shipping address</span>
            {errorMessage && <div className="shipping-address-form-error-essage">{errorMessage}</div>}
            <div>
                <label htmlFor="country">
                    <span className="shipping-address-form-text">Country:</span>
                    <select id="country" value={country} onChange={e =>
                        setCountry(e.target.value)}>
                    </select>
                </label>
            </div>
        </form>
    )
};

export default ShippingAddressForm;