import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Navigation from "./Navigation";


//the navigation bar and the hamburger navigation bar in case the user is using a mobilephone
export default function Header(props) {

    let {isLoggedIn, logout} = useContext(AuthContext);
    let {siteImg} = props;
    let image = <img src={siteImg} alt="Site Image" id="siteImg" />
    let logoutBtn = <span onClick={logout}>Logout</span>

    if(isLoggedIn){
        return (
            <>
            <header>
                <Navigation
                    links={[
                        { route: "/", text: image },
                        { route: "/products", text: "Products" },
                        { route: "/car-info", text: "Car Information" },
                        { route: "/car-comparison", text: "Car Comparison" },
                        { route: "#", text: logoutBtn}
    
                    ]}
                />
            </header>
            </>
        );
    }

    else{
        return(
            <>
            <header>
                <Navigation
                    links={[
                        { route: "/", text: image },
                        { route: "/car-info", text: "Car Information" },
                        { route: "/car-comparison", text: "Car Comparison" },
                        { route: "/login", text: "Login"}
    
                    ]}
                />
            </header>
            </>
        )
    }
}