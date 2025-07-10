import Navbar from "../components/Navbar";


function MainLayot({children}:{children:React.ReactNode}){
    return(
        <>
            <Navbar/>
            <div className="pt-20 px-5 md:px-20 max-w-[1500px] m-auto">
                {children}
            </div>
        </>
    )
}

export default MainLayot;