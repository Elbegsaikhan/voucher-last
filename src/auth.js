module.exports = {
    user: function(req, res, next) {
        if(req.user){
            next();
        }else{
            return res.status(400).json({message: 'Хандах эрхгүй байна'});
        }
    },
    company: function(req, res, next) {
        if(req.user && (req.user.role === 'company' || req.user.role === 'admin')){
            next();
        }else{
            return res.status(400).json({message: 'Хандах эрхгүй байна'});
        }
    },
    admin: function(req, res, next) {
        if(req.user && req.user.role === 'admin'){
            next();
        }else{
            return res.status(400).json({message: 'Хандах эрхгүй байна'});
        }
    }
};