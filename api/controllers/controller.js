const Product = require('../models/product');
const moment = require('moment');
const Order = require('../models/order');
const Response = require('../response/response');

module.exports = {

//     get the base url
    getBaseUrl: (req, res, next)=>{
        res.status(200).json({
            Error: false,
            message: 'Welcome to product api'
        });
    },

//     get all products
    getAllProducts: (req, res, next)=>{
        Product.find({})
        .select('name price _id product_image created_at')
        .exec()
        .then(products =>{
            const response = {
                error: false,
                count: products.length,
                products: products.map( product =>{
                    return{
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        image_path: product.product_image,
                        created_at: product.created_at
                    }
                })
            }
            res.status(202).json(response);

        }).catch(err =>{
            Response(res)
            .error_res(err, 400);
        });
    },
    
//     create product
    createProduct:  (req, res, next)=>{
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            product_image: req.file.path
        });
        //console.log(req.file);
        product.save()
        .then( product=>{

            const response = {
                error: false,
                message: 'Product succesfully saved into db',
                createdProduct: {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image_path: product.product_image,
                    created_at: product.created_at
                }
            };
            res.status(201).json(response)
        })
        .catch( err=>{
            Response(res)
            .error_res(err, 500)
        });
    },
    getProduct: (req, res, next)=>{
        Product.findById(req.params.id)
        .select('_id name price product_image created_at')
        .exec()
        .then( (product)=>{
            res.status(201).json({
                Error:false,
                product: product
            });
        })
        .catch(err=>{
            Response(res)
            .error_res(err, 500)
        });
    },

    patchProduct: (req, res, next)=>{
        let newBody = {
            name: req.body.name,
            price: req.body.price,
            created_at: moment().format('dddd MMMM Do YYYY, h:mm:ss a')
        }
        Product.findByIdAndUpdate(req.params.id, 
            newBody, {new: true})
            .select({'__v':0})
            .then( newProd=>{
                res.status(202).json({
                    Error: false,
                    message: 'product succesfully updated',
                    updated_product: newProd
                })
            })
            .catch( err=>{
                Response(res)
            .error_res(err, 400)
            })
    },
    deleteProduct: (req, res, next)=>{
        Product.deleteOne({_id: req.params.id})
        .then( product=>{
            res.status(200).json({
                Error: false,
                message: `The product was succesfully deleted`
            });
        })
        .catch( err=>{
            Response(res)
            .error_res(err, 400)
        });
    },

    // controller for order routes

    getOrderBase: (req, res, next)=>{
        res.status(200).json({
            Error:false,
            message: 'Welcome to order api'
        });
    },
    getAllOrders: (req, res, next)=>{
        Order.find({})
        .populate('productID')
        .select({"__v":0})
        .exec()
        .then( orders =>{
            res.status(202)
            .json({
                error: false,
                message: 'Succesfully fetched list of orders',
                orders_count: orders.length,
                orders: orders
            });
        })
        .catch( err=>{
            Response(res)
            .error_res(err, 404)
        });
    },
    createOrder: (req, res, next)=>{
        Product.findById(req.body.productID)
        .select({"__v":0,
        "created_at":0, "_id":0})
        .then( product=>{
            if(!product){
                return res.status(404).json({
                    statusCode: 404,
                    message: 'product not found'
                });
            }
            else{
                const order = new Order({
                    productID: req.body.productID,
                    quantity: req.body.quantity
                });
                return order.save()
                .then( order=>{
                    res.status(201)
                    .json({
                        error:false,
                        message: 'Order was made succesfully',
                        order: {
                            orderID: order._id,
                            time_ordered: order.ordered_at,
                            quantity: order.quantity,
                            productID: order.productID,
                            ordered_product: product
                        }
                    })
                })
                .catch( err=>{
                    Response(res)
                    .error_res(err, 500)
                });
            }
            
        })
        .catch( err=>{
            Response(res)
            .error_res(err, 500)
        });
    },
    getOrder: (req, res, next)=>{
        Order.findById(req.params.id)
        .select({"__v":0})
        .populate('productID created_at _id name')
        .exec()
        .then( order=>{
            res.status(201).json({
                Error: false,
                Order: order
            });
        })
        .catch( err=>{
            Response(res)
            .error_res(err, 404)
        });
        
    },
    deleteOrder: (req, res, next)=>{
        Order.deleteOne({_id:req.params.id})
        .then( order=>{
            res.status(201).json({
                Error:false,
                message: `Order with ${req.params.id} deleted succesfully`
            });
        })
        .catch( err=>{
            Response(res)
            .error_res(err, 404)
        });
    }
}

