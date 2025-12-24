# API's bulding

## Authrouter
-   POST / signup
-   POST / login
-   POST / logout

## profileRouter 
-   GET/profile/view
-   PATCH/profile/edit
-   PATCH/profile/password

## Connectionrequestrouter
## request/ send/ :status/ :userId

-   POST/ request/ send/ interested/ :userId
-   POST/ request/ send/ ignored/ :userId

-   POST/ request/ review/ accepted/ :requestId
-   POST/ request/ review/ rejected/ :requestId

-   GET/ user/ connections
-   GET/ user/ requests
-   GET/ user/ feed - Gets us the other users profile on platform

Status of connections - ignore, interested, accepted, rejected