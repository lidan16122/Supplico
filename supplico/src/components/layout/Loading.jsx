import React from "react";
import { Ring } from "@uiball/loaders";

export default function Loading(){
    return(
        <div className="parent text-center">
            <div className="color-black loading">
              <h1>LOADING</h1>
              <Ring size={100} lineWeight={5} speed={2} color="black" />
            </div>
          </div>
    )
}