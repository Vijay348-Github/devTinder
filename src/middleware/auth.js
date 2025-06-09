const adminAuth = (req, res, next) => {
    console.log("Admin auth is getting checked");
    const token = "xz";
    const isAdminAuthorised = token === "xyz";

    if (!isAdminAuthorised){
        res.status(401).send("unauthorised request")
    }else{
        next();
    }
}

module.exports = {
    adminAuth
}   