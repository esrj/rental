const {User} = require('../model/user')
const sequelize = require('../util/database')


const login = (req, res, next) => {
    if(req.session.isLogin === true){
        res.redirect('/')
    }else{
        if(req.method === 'GET'){
            res.render('users/login');
        }else{
            User.findOne({where:{'email':req.body['email']}}).then(user=>{
                if(user){
                    if(req.body['password'] === user.password){
                        req.session.isLogin = true
                        req.session.user = user
                        req.session.save()
                        res.send({'errno':0})
                    }else{
                        res.send({'errno':1})
                    }
                }else{
                    res.send({'errno':1})
                }
            }).catch(()=>{
                res.send({'errno':1})
            })
        }

    }
}

const register = (req, res, next) => {
    if(req.session.isLogin === true){
        res.redirect('/')
    }else{
        if(req.method === 'GET'){
            res.render('users/register');
        }else{
            const name = req.body['name']
            const password = req.body['password']
            const identity = req.body['identity']
            const email = req.body['email']
            const country= req.body['country']
            const birthday= req.body['birthday']
            const phone= req.body['phone']
            sequelize.sync().then(() => {
                User.create({
                    name :name,
                    password: password,
                    identity:identity,
                    email:email,
                    country:country,
                    birthday:birthday,
                    phone:phone,
                }).then(()=>{
                    res.send({'errno':0})
                })
            })
        }
    }
}

const logout = (req,res,next)=>{
    req.session.destroy()
    res.redirect('/login/')
}

module.exports = {login,register,logout}