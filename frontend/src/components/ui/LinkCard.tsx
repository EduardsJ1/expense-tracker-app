import type { ReactNode } from "react";
import { Link } from "react-router-dom"


function LinkCard({to,title,description,icon,iconbackground}:{to:string,title:string,description:string,icon:ReactNode,iconbackground:string}){


    return(
        <Link to={to} className="bg-white rounded-2xl w-2xs shadow-xl pb-5 hover:bg-neutral-50 cursor-pointer">
            <div className={`w-max m-auto mt-5 rounded-full p-2 ${iconbackground}`}>{icon}</div>
            <div className="mt-4">
                <h3 className="text-center text-xl font-semibold">{title}</h3>
                <p className="text-center text-xs mt-1 text-neutral-500">{description}</p>
            </div>
        </Link>
    )
}

export default LinkCard;