import React, { useState } from "react";
import Navigation from "./Navigation";
//the navigation bar and the hamburger navigation bar in case the user is using a mobilephone
export default function Header(props) {
    let {siteImg} = props;
    let image = <img src={siteImg} alt="Site Image" id="siteImg" />
    return (
        <>
        <header>
            <Navigation
                links={[
                    { route: "/", text: image },
                    { route: "/products", text: "Products" },
                    { route: "/car-info", text: "Car Information" },
                    { route: "/car-comparison", text: "Car Comparison" },
                    { route: "/login", text: "Login"}

                ]}
            />
        </header>
        </>
    );
}