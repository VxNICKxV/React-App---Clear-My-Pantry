 import React from 'react'
 import { Link } from 'react-router-dom'

//a button that takes us back to the home page
const BackToHome = () => {
    return (
        <Link to="/">
            <button>Back to Home</button>
        </Link>
    )
}

export default BackToHome