const ItemCard = ({ items }) => {
    return (
        <div>
            Items:
            {
                items?.map((item, index) => {
                    return (
                        <div key={index}>
                            <img src={item.image} alt="alt-item-image"/>
                            <p>{item.name}</p>
                            <p>{item.price}</p>
                            <div className="colors">
                                Colors:
                                {item.colors.map((color, index) => {
                                    return (
                                        <div key={index * 2}>{color.name}</div>
                                    )
                                })}
                            </div>
                            <div className="sizes">
                                Sizes:
                                {item.sizes.map((size, index) => {
                                    return (
                                        <div key={index * 3}>{size.value}</div>
                                    )
                                })}
                            </div>
                            <div>Add to cart</div>
                        </div>
                    )
                })
            }
        </div>
    )
};

export default ItemCard;