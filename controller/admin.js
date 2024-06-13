const {User, Comment} = require('../model/user')
const  {Brand,Vehicle} = require('../model/vehicle')
const Place = require('../model/place')
const sequelize = require('../util/database')
const {where} = require("sequelize");
const {DailyRental} = require('../model/order')

const login = (req, res, next) => {
    if(req.session.isLogin === true){
        res.redirect('/admim/')
    }else{
        if(req.method  === 'GET'){
            res.render('admin/login');
        }else{
            User.findOne({where:{'email':req.body['email']}}).then(user=>{
                if(user){
                    if(user.permission === 1){
                        res.send({'errno':2})
                    }else{
                        if(req.body['password'] === user.password){
                            req.session.isLogin = true
                            req.session.user = user
                            req.session.save()
                            res.send({'errno':0})
                        }else{
                            res.send({'errno':1})
                        }
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
const index = async (req, res, next) => {
    if(!req.session.isLogin){
        res.redirect('/admin/login')
    }else{
        if(req.method === 'GET'){
            const orders = await DailyRental.findAll({
                include: [
                    {
                        model: User,
                    },
                    {
                        model: Vehicle,
                    }
                ],
                order: [
                    ['rental_time', 'DESC']
                ]
            });

            res.render('admin/index',{
                'user':req.user,
                'orders':orders
            })
        }
    }
}
const brand = (req, res, next) => {
    if(!req.session.isLogin){
        res.redirect('/admin/login')
    }else{
        if(req.method === 'GET'){
            res.render('admin/brand',{
                'user':req.user
            })
        }else if(req.method === 'POST'){
            Brand.findAll().then(brands=>{
                if(req.body['fetch'] === 1){
                    res.send({'errno':0,'brands':brands})
                }else{
                    sequelize.sync().then(() => {
                        Brand.create({
                            name:req.body['name'],
                            en_name:req.body['en_name']
                        }).then((brand)=>{
                            res.send({'errno':0,'brand':brand})
                        })
                    })
                }
            })
        }else if(req.method === 'PATCH'){
            Brand.destroy({
                where: { id: req.body['id'] }
            }).then(() => {
                Brand.findAll().then(brands=>{
                    res.send({'errno':0,'brands':brands})
                })
            });
        }
    }
}

const vehicle = (req, res, next) => {
    if(!req.session.isLogin){
        res.redirect('/admin/login')
    }else{
        if(req.method === 'GET'){
            res.render('admin/vehicle',{
                'user':req.user
            })
        }else if(req.method === 'POST'){
            if(req.body['fetch'] == 0) {
                const type = {
                    '1': 'car',
                    '2': 'Luxury_car',
                    '3': 'RV',
                    '4': 'boxcar',
                    '5': 'motorcycle',
                    '6': 'truck'
                }
                const typeId = req.body['type']
                Vehicle.create({
                    'brandId': req.body['brand'],
                    'image': req.file.path,
                    'name': req.body['name'],
                    'age': Number(req.body['age']),
                    'type': type[typeId],
                    'license_plate': req.body['license_plate'],
                    'introduction': req.body['introduction'],
                    'subscription': req.body['sub'],
                    'price': req.body['price']
                }).then((vehicle) => {
                    res.send({'errno': 0,"vehicle":vehicle})
                })
            }else if(req.body['fetch'] === 1){
                Vehicle.findAll().then(vehicles=>{
                    return res.send({'errno': 0,vehicles:vehicles})
                })
            }
        }else if(req.method === 'PATCH'){
            Vehicle.destroy({
                where: { id: req.body['id'] }
            }).then(() => {
                Vehicle.findAll().then(vehicles=>{
                    res.send({'errno':0,'vehicles':vehicles})
                })
            });
        }
    }
}
const place = (req, res, next) => {
    if(!req.session.isLogin){
        res.redirect('/admin/login')
    }else{
        if(req.method === 'GET'){
            res.render('admin/place',{
                'user':req.user
            })
        }else if(req.method === 'POST'){
            Place.findAll().then(places=>{
                if( req.body['fetch'] === 1 ){
                    res.send({'errno':0,'places':places})
                } else {
                    Place.create({
                        name:req.body['name'],
                        address:req.body['address'],
                        area:req.body['area'],
                        city:req.body['city'],
                    }).then((place)=>{
                        res.send({'errno':0,"place":place})
                    })
                }
            })
        }else if(req.method === 'PATCH'){
            Place.destroy({
                where: { id: req.body['id'] }
            }).then(() => {
                Place.findAll().then(places=>{
                    res.send({'errno':0,'places':places})
                })
            });
        }
    }
}
const bill = (req, res, next) => {
    if(!req.session.isLogin){
        res.redirect('/admin/login')
    }else{
        res.render('admin/bill',{
            user:req.user
        })
    }
}



module.exports = {login,index,brand,place,vehicle,bill}