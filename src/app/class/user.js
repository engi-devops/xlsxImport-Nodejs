import userModel from '../models/user.model'
import JwtTokenGenerator from './helpers/JwtTokenGenerator';
import importExlSheetModel from '../models/importExlSheet.model'
// import xlsx from 'xlsx'
var XLSX = require('xlsx');


class user {

    constructor(data) {

        this.email = data.email != undefined ? data.email : null;
        this.password = data.password != undefined ? data.password : null;
        this.username = data.username != undefined ? data.username : null;

        this.adminOrUser = data.adminOrUser != undefined ? data.adminOrUser : null;
        this.phone = data.phone != undefined ? data.phone : null;
        this.fullname = data.fullname != undefined ? data.fullname : null;
        this.importExl = data.importExl != undefined ? data.importExl : null;

        this.token = data.token != undefined ? data.token : null;

        this.key_array = ["username", "phone", "fullname", "email", "password",
            "adminOrUser"
        ];
    }

    insertdata(key_array, type) {
        var data = {};
        for (let i = 0; i < key_array.length; i++) {
            if (this[key_array[i]] == null || (this[key_array[i]] === "" && type == "A")) {
                // delete key_array[i];
            } else {
                data[key_array[i]] = this[key_array[i]];
            }
        }
        return data;
    };

    async createAdminOrUser(success, error) {
        try {
            var instance = this

            userModel.find({ "email": instance.email }).then(async user => {
                console.log('user :>> ', user);
                if (user.length > 0) {
                    error(Response.sendResponse(status_codes.INTERNAL_SERVER_ERROR, custom_message.errorMessage.userAlreadyExits, [], []));
                } else {
                    let user = userModel(instance.insertdata(instance.key_array));
                    user.save().then(async user => {
                        delete user.password
                        success(Response.sendResponse(status_codes.CREATED, custom_message.infoMessage.createAdminOrUser, user, []));
                    })
                }
            })
        } catch (err) {
            // console.log('err :>> ', err);
            error(Response.sendResponse(status_codes.INTERNAL_SERVER_ERROR, custom_message.errorMessage.genericError, [], err));
        }
    };



    async login(success, error) {
        try {
           let instance = this;
            let email = instance.email;
            let condition = {
                "email": {
                    $regex: new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i")
                }
            };
            userModel.findOne(condition).then(async user => {
                if (user) {
                    let checkPasswordValidOrNot = await user.comparePassword(instance.password);
                    if (!checkPasswordValidOrNot) {
                        error(Response.sendResponse(status_codes.UNAUTHORISED, custom_message.errorMessage.Wrongpassword, {}));
                    } else {
                        const token = await JwtTokenGenerator.createToken(user._id,user.email,user.adminOrUser);
                        let response = {
                            token: token,
                        }
                        success(Response.sendResponse(status_codes.OK, custom_message.infoMessage.AdminOrUser, response));
                    }
                } else {
                    error(Response.sendResponse(status_codes.NOTFOUND, custom_message.errorMessage.userNotFound,{}));
                }
            })
        } catch (err) {
            error(Response.sendResponse(status_codes.INTERNAL_SERVER_ERROR, custom_message.errorMessage.genericError,{}));
        }
    };

    async importExlSheet(success, error) {
        try {
            
            var workbook = XLSX.readFile(__dirname + '/Users.xlsx');
            var xlsxSheetAllData = workbook.SheetNames;
            var data = [];

            xlsxSheetAllData.forEach(function (y) {
                var worksheet = workbook.Sheets[y];
                var headers = {};
                for (const z in worksheet) {
                    if (z[0] === '!') continue;
                    var tt = 0;
                    for (var i = 0; i < z.length; i++) {
                        if (!isNaN(z[i])) {
                            tt = i;
                            break;
                        }
                    };
                    var col = z.substring(0, tt);
                    var row = parseInt(z.substring(tt));
                    var value = worksheet[z].v;

                    if (row == 1 && value) {
                        headers[col] = value;
                        continue;
                    }
                    if (!data[row]) data[row] = {};
                    data[row][headers[col]] = value;
                }
                data.shift();
                data.shift();
            });
           
            for (let index = 0; index < data.length; index++) {

                let insert = {
                    username: data[index].username,
                    fullname: data[index].fullname,
                    email: data[index].email,
                    phone: data[index].phone
                }
                
                await importExlSheetModel.find({}).then(async uuu => {
                    if(uuu.length > 0){
                        if (uuu[index].email == data[index].email && uuu[index].phone == data[index].phone) {
                            await importExlSheetModel.findOneAndUpdate({email:uuu[index].email},{$set:{
                                username: data[index].username,
                                fullname: data[index].fullname
                            }}, {
                                upsert: true,
                                new: true,
                            });
                        }
                    } else {
                    let excel = importExlSheetModel(insert);
                    excel.save().then(async excel => {
                            console.log('excel :>> ', excel);
                        })
                    }
                })
            }
            success(Response.sendResponse(status_codes.CREATED, custom_message.infoMessage.allUserAddSuccess, [], []));
        } catch (err) {
            console.log('err :>> ', err);
            error(Response.sendResponse(status_codes.INTERNAL_SERVER_ERROR, custom_message.errorMessage.genericError, [], err));
        }
    }


     async allUserList(success, error) {
         try {

             importExlSheet.find({}).then(async done => {
                //  console.log('done :>> ', done);
                //  return
                 success(Response.sendResponse(status_codes.OK, custom_message.infoMessage.getUserList, done, []));
             }).catch(err => {
                 error(Response.sendResponse(status_codes.BAD_REQUEST, custom_message.errorMessage.genericError, [], err));
             })
         } catch (err) {
             error(Response.sendResponse(status_codes.INTERNAL_SERVER_ERROR, custom_message.errorMessage.genericError, [], err));
         }
     }

}

module.exports = user;