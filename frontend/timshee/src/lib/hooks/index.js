import {useEffect, useState} from "react";

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            // console.log('Window resized to:', window.innerWidth, window.innerHeight);
            setWindowSize({width: window.innerWidth, height: window.innerHeight});
        };

        window.addEventListener("resize", handleResize);
        return () => {
            // console.log('Cleaning up resize event listener');
            window.removeEventListener("resize", handleResize);
        }
    }, []);
    // console.log('Value is going to leave:', windowSize.width, windowSize.height);
    return windowSize;
};

export { useWindowSize };