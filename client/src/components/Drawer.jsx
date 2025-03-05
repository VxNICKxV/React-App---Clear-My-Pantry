// step 1 - import files and packages
import './Drawer.css'
import { MdClose } from 'react-icons/md';

const Drawer = ({ showDrawer, onClose, recipe }) => {
    console.log('recipe in drawer is ', JSON.stringify(recipe))
    return (
        // step 2 - create classname for drawer
        // - drawer will be open or closed.
        <div className={`drawer ${showDrawer ? 'drawer-open' : 'drawer-close'}`}>
            {/* step 4 - close button */}
            <div className='close-btn-container' onClick={onClose}>
                <MdClose size={30} />
            </div>
            {/* step 5 - display recipe image */}
            <img src={`/images/${recipe.img}`} className='recipe-image' alt="recipe-img" />
            {/* step 6 - disply recipe title */}
            <div>{recipe.title}</div>
            {/* step 7 - display recipe ingredients */}
            <div className='ingredients-container'>
                {recipe.ing.map((ingr, index) => (
                    <div
                        key={index}
                        className='ingredients'>
                        {ingr}
                    </div>
                ))}

                {/* recipe description */}
                <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta, recusandae maxime? Excepturi rem earum doloribus soluta quod assumenda obcaecati. Doloribus atque, dicta repellat illo blanditiis voluptas magnam deserunt minima nulla?
                </p>
            </div>

        </div>

    );



};




export default Drawer;
