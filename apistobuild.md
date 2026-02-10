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

## - POST/ request/ review/ accepted/ :requestId

-   POST/ request/ review/ accepted/ :requestId
-   POST/ request/ review/ rejected/ :requestId

-   GET/ user/requests/received
-   GET/ user/ connections
-   GET/ user/ feed - Gets us the other users profile on platform

## for every page the skip should be (page-1)*limit

 -  feed/page=1&limit=10   => 1-10 => .skip(0).limit(10) 
 -  feed/page=2&limit=10   => 11-20 => .skip(10).limit(10)
 -  feed/page=3&limit=10   => 21-30 => .skip(20).limit(10)


Status of connections - ignore, interested, accepted, rejected

## chat feature real time using socket.io
 - /chat/:messagetoid


## Ports on  which frontend and backend deployed

 - Frontend - http://52.91.222.110/
 - Backend - http://52.91.222.110:3000/

 Domain -> 52.91.222.110 = connect.com

## connect OR bridge OR connect.social

 Frontend - connect.com
 Backend - connect.com/api