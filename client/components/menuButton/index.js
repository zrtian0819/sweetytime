import { useState, useEffect } from "react";
import Styles from "./menuButton.module.scss";

export default function MenuButton({ navOpen, setNavOpen }) {
    
    return (
        <div className={Styles["menu-button"]} onClick={() => setNavOpen(prev => !prev)}>
            <div className={`${Styles["line"]} ${navOpen ? Styles["upperLine-opened"] : ""}`}></div>
            <div className={`${Styles["line"]} ${navOpen ? Styles["midLine-opened"] : ""}`}></div>
            <div className={`${Styles["line"]} ${navOpen ? Styles["lowerLine-opened"] : ""}`}></div>        
        </div>
    );
}