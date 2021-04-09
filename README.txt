- I completed all the requirements and extensions in the criteria (listed at the bottom of this file)
- CSS styling (e.g. customized colours and fonts) (see 'public/css/style.css')
- Static 'toolbar' at the top of the site, showing all the available pages
- I separated my routing logic between 'users.js', 'foods.js', 'api.js', 'admin.js', and 'main.js'
- Validation checks on all forms (see 'lib/validationChecks.js')
- All user accounts must have unique usernames, an error will be receieved if the username is in use
- Admin accounts (created with '/registeradmin' route) that grants control over the user + food mongo collections ('/clearusers' and '/clearfoods' routes). Code for redirecting non-admin and non-logged in users is in 'lib/redirects.js'
- I defined some constants ('.env') to avoid having to retype mongodb paths and collections
- I used ejs templating for sections that were reused a lot (e.g. the persistent navigation bar ('views/partials/navBar.ejs') and success/error messages ('views/partials/messageTemplate.html'))
- Food items can only be updated or deleted by the user that created the food item
- Multiple food items can be selected (by weight) and have their combined nutritional values displayed in a tabular format ('views/listfoods.html'))

- Added API support for GET, POST, PUT, and DELETE
    - Example CURL commands:
        - GET all food items (add id at the end for a specific item):
            curl --location --request GET 'http://www.doc.gold.ac.uk/usr/398/api/{id}'
        - ADD a new food item:
            curl --location --request POST 'http://www.doc.gold.ac.uk/usr/398/api' \
                --header 'Content-Type: application/json' \
                --data-raw '{
                    "name":"ADDED FOOD",
                    "price":"1",
                    "typicalValues":"2",
                    "typicalValuesUnit":"grams",
                    "calories":"3",
                    "carbohydrates":"4",
                    "fat":"5",
                    "protein":"6",
                    "salt":"7",
                    "sugar":"8",
                    "author":"curl"
                }'
        - UPDATE an existing food item, replace {id} with food id
            curl --location --request PUT 'http://www.doc.gold.ac.uk/usr/398/api/{id}' \
                --header 'Content-Type: application/json' \
                --data-raw '{
                    "name":"UPDATED FOOD",
                    "price":"1",
                    "typicalValues":"2",
                    "typicalValuesUnit":"grams",
                    "calories":"3",
                    "carbohydrates":"4",
                    "fat":"5",
                    "protein":"6",
                    "salt":"7",
                    "sugar":"8"
                }'
        - to DELETE an existing food item
            curl --location --request DELETE 'http://www.doc.gold.ac.uk/usr/398/api/{id}'
    - The API will respond with appropriate codes (200, 400, 404) and will tell the user if something is wrong with their request

- Mark scheme (in the order listed on learn.gold):
    - Requirement 1 Readme file             - Complete ('readme.txt')
    - Requirement 2 Home page               - Complete ('views/index.html')
    - Requirement 3 Register page           - Complete ('routes/user.js' line ~20)
    - Requirement 4 Login                   - Complete ('routes/user.js' line ~60)
    - Requirement 5 Add food page           - Complete ('routes/food.js' line ~15)
    - Requirement 8 List page	            - Complete ('views/listfoods.html')
    - Requirement 11 List page back-end     - Complete ('routes/food.js' line ~150)
    - Requirement 6 Update food page        - Complete ('routes/food.js' line ~50)
    - Requirement 7 Delete food page        - Complete ('routes/food.js' line ~120)
    - Requirement 9 form-validation         - Complete ('lib/validationChecks.js')
    - Requirement 10 Feedback messages      - Complete ('views/templates/messageTemplate.html')
    - Requirement 13 Sessions               - Complete ('lib/redirects')
    - Requirement 14 Hashed password        - Complete ('routes/user.js' line ~40)
    - Requirement 15 Logout                 - Complete ('routes/user.js' line ~100)
    - Requirement 16 API                    - Complete ('routes/api.js')
    - Requirement 17 Links to home page     - Complete ('views/partials/navBar.ejs')
    - Requirement 3 Good commenting         - Complete
    - Update/delete available to user who added that food     - Complete ('views/update_result.html')
    - Advanced API                          - Complete ('routes/api.js')