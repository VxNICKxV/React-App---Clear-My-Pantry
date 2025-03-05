-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2025-02-02 04:07:49.815

-- tables
-- Table: INGREDIENTS
CREATE TABLE  pantryschema.INGREDIENTS (
    INGREDIENTS_ID serial  NOT NULL,
    Ingredients_Name varchar(50)  NOT NULL,
    Category varchar(50)  NOT NULL,
    RECIPE_ID integer  NOT NULL,
    Quantity_n_Units varchar(25)  NOT NULL,
    CONSTRAINT INGREDIENTS_pk PRIMARY KEY (INGREDIENTS_ID)
);

-- Table: RECIPES
CREATE TABLE  pantryschema.RECIPES (
    RECIPE_ID serial  NOT NULL,
    USER_ID integer  NOT NULL,
    Recipe_Name varchar(50)  NOT NULL,
    Description text  NOT NULL,
    Steps text[]  NOT NULL,
    Img varchar(1000)  NULL,
    CONSTRAINT RECIPES_pk PRIMARY KEY (RECIPE_ID)
);

-- Table: USERS
CREATE TABLE  pantryschema.USERS (
    USER_ID serial  NOT NULL,
    Clerk_User_Id varchar(50)  NOT NULL,
    Email varchar(100)  NOT NULL,
    Seconds_Since_Epoch bigint  NOT NULL DEFAULT extract(epoch from now())::bigint,
    CONSTRAINT USERS_pk PRIMARY KEY (USER_ID)
);

-- foreign keys
-- Reference: INGREDIENTS_RECIPES (table: INGREDIENTS)
ALTER TABLE pantryschema.INGREDIENTS ADD CONSTRAINT INGREDIENTS_RECIPES
    FOREIGN KEY (RECIPE_ID)
    REFERENCES pantryschema.RECIPES (RECIPE_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Recipes_User (table: RECIPES)
ALTER TABLE RECIPES ADD CONSTRAINT Recipes_User
    FOREIGN KEY (USER_ID)
    REFERENCES USERS (USER_ID)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.

