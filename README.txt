- I completed all the requirements and extensions in the criteria
- CSS styling (e.g. customized colours and fonts) (see 'public/css/style.css')
- Static 'toolbar' at the top of the site, showing all the available pages
- I separated my routing logic between 'users.js', 'foods.js', 'api.js', 'admin.js', and 'main.js'
- Validation checks on all forms (see 'lib/validationChecks.js')
- Admin accounts (created with '/registeradmin' route) that grants control over the user + food mongo collections ('/clearusers' and '/clearfoods' routes). Code for redirecting non-admin and non-logged in users is in 'lib/redirects.js'
- I defined some constants ('.env') to avoid having to retype mongodb paths and collections
- I used ejs templating for sections that were reused a lot (e.g. the persistent navigation bar ('views/partials/navBar.ejs') and success/error messages ('views/partials/messageTemplate.html'))

- Added API support for GET, POST, PUT, and DELETE
    - Example CURL commands:
        - curl --location --request GET 'http://www.doc.gold.ac.uk/usr/398/api/{id}' (to GET all food items (add id at the end for a specific item))
        - curl --location --request POST 'http://www.doc.gold.ac.uk/usr/398/api' \
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
            (to ADD a new food item)
        - curl --location --request PUT 'http://www.doc.gold.ac.uk/usr/398/api/{id}' \
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
            (to UPDATE an existing food item, replace {id} with food id)
        - curl --location --request DELETE 'http://www.doc.gold.ac.uk/usr/398/api/{id}'
            (to DELETE an existing food item)