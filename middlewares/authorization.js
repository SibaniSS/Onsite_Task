function authorizationUser(req, res, next)
{
    const user=req.user
    if(user.role =="admin"){
        next()
    }
    else{
        res.status(404).send("u cant acess")
    }
}
module.exports = {
    authorizationUser
}