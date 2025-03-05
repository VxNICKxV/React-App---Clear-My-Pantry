import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react"
import { Link } from "react-router-dom"
import "./Navbar.css";
// Navbar function component
function Navbar() {
    return (
        <>
           
            {/* Start of the navigation bar */}
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    {/* Brand name for the navbar */}
                    <a className="navbar-brand" href="/"></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {/* What links should a user see when signed in? */}
                    <SignedIn>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/addRecipe">Add a Recipe</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/myrecipes">My Recipes</Link>
                            </li>
                        </ul>
                        {/* Provided to user from clerk to manage account - we have to tell it where to send our user after they log out */}
                        <UserButton aftersignouturl='/' />
                    </SignedIn>
                    {/* If we want to logout or sign out how can we accomplish this? */}
                    <SignedOut>
                        <div className="signInMessage">
                            <h5 >SIGN IN TO SEE YOUR RECIPES</h5>
                        </div>
                        <div className="d-flex ms-auto">
                            <SignInButton className="px-3 py-1 rounded-1 btn btn-secondary" aftersigninurl='/' />
                        </div>
                    </SignedOut>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar