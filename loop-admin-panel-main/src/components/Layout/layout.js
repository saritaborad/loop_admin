import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";

function Layout(props) {
    const removeLayer = () => {
        document.getElementById("root").classList.remove("dash-main-class-add");
    };

    return (
        <>
            <Header />
            <Sidebar />
            {props.children}
            <Footer />
            <div className="overlay toggle-icon-main" onClick={removeLayer}></div>
        </>
    );
}

export default Layout;
