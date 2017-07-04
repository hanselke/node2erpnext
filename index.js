'use strict';

/**
 *  ERPNext class will exports public api.
 */

var request = require('request');
var requestPromise = require('request-promise');
var querystring = require('querystring');
var Promise = require('bluebird');

var ERPNext = function (options) {
    this.username = options.username;
    this.password = options.password;
    this.baseUrl = options.baseUrl;
    this.cookieJar = request.jar();
};

ERPNext.prototype.constructor = ERPNext;

/**
 *  Doing Login of a user and stores session cookie into cookieJar.
 *  @return {Promise} resolve response.
 */

ERPNext.prototype.login = function () {
    var _this = this;
    var formData = querystring.stringify({ usr: _this.username, pwd: _this.password });
    var contentLength = formData.length;
    return requestPromise.post({
        url: _this.baseUrl + "/api/method/login",
        jar: _this.cookieJar,
        body: formData,
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).catch (err => {
        if (err.statusCode === 401) { 
                err.message = "Authorization Error, you have entered an invalid password"
                throw err
            }
            else { throw err}
            
    })
}


/**
 * Create a Custom Field
 * For param follow https://frappe.github.io/frappe/current/models/custom/custom_field
 */

ERPNext.prototype.createCustomField= async function(object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(async function () {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Custom Field",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(async function (res) {
            res = await JSON.parse(res);
            return res;
        }).catch  (async err => { 
            err = await err
            //console.log(err)
            var regex = /Traceback .*<\/pre>/gi;
            var regex2 = /ValidationError: (.*)\b/;
            err.message = JSON.stringify(err.message).match(regex)
            if (err.statusCode === 417) { 
                err.message = "Validation Error: " + JSON.stringify(err.message).match(regex2)[1]
                throw err
            }
            else { throw err}
            })
    })
}

/**
 *  Will Call REST API to getCompanyAbbr
 */

ERPNext.prototype.getCompanyAbbr = async function (req) {
    var _this = await this;
    //console.log("lib req :" + req)
    var params = '[["Company","company_name","=",' + JSON.stringify(req) +  ']]'
    var fields = '["abbr"]'
    return _this.login().then(function () {
        return requestPromise.get({
            url: _this.baseUrl + '/api/resource/Company?fields=' + fields + '&filters=' + params,
            jar: _this.cookieJar,
        }).then(async function (res) {
            res = await JSON.parse(res)
            res = res.data[0].abbr
            //console.log("lib getCompanyAbbr res :" + res)
            //erpnext api returns empty response instead of throwing error
            return res 
            
        }).catch  (async err => { 
            err = await err
            throw err
        })
    });
}


/**
 *  Will Call REST API to getCompanyDefaultPayrollPayableAccount
 */

ERPNext.prototype.getCompanyDefaultPayrollPayableAccount = async function (req) {
    var _this = await this;
    //console.log("lib req :" + req)
    var params = '[["Company","company_name","=",' + JSON.stringify(req) +  ']]'
    var fields = '["default_payroll_payable_account"]'
    return _this.login().then(function () {
        return requestPromise.get({
            url: _this.baseUrl + '/api/resource/Company?fields=' + fields + '&filters=' + params,
            jar: _this.cookieJar,
        }).then(async function (res) {
            res = await JSON.parse(res)
            res = res.data[0].default_payroll_payable_account
            //console.log("lib getCompanyDefaultPayrollPayableAccount res :" + JSON.stringify(res))
            //erpnext api returns empty response instead of throwing error
            return res 
            
        }).catch  (async err => { 
            err = await err
            throw err
        })
    });
}
/**
 *  Update Company
 */

ERPNext.prototype.updateCompany = async function(name, object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(async function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Company/"+ name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(async function (res) {
            res = await res
            //console.log("lib updateCompany res: " + res)
            return res
        }).catch  (async err => { 
            err = await err
            //TODO if 404, traceback regex wont work. returns null for now
            var regex = /Traceback .*<\/pre>/gi;
            var regex2 = /ValidationError: (.*)\b/;
            err.message = JSON.stringify(err.message).match(regex)
            if (err.statusCode === 417) { 
                err.message = "Validation Error: " + JSON.stringify(err.message).match(regex2)[1]
                throw err
            }
            else { throw err}
            })
    })
}


/**
 *  Will Call REST API to List of Companies
 */

ERPNext.prototype.getCompanies= async function () {
    var _this = this;
    return _this.login().then(async function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Company",
            jar: _this.cookieJar,
        }).then(async function (res) {
            res = await JSON.parse(res)
            return res;
        }).catch  (async err => { 
            err = await err
            throw err
            })
    });
}
/**
 * Create a Employee
 * For param follow https://frappe.github.io/erpnext/current/models/hr/employee
 */

ERPNext.prototype.createEmployee= async function(object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(async function () {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Employee",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(async function (res) {
            res = await JSON.parse(res);
            return res;
        }).catch  (async err => { 
            err = await err
            //console.log(err)
            var regex = /Traceback .*<\/pre>/gi;
            var regex2 = /ValidationError: (.*)\b/;
            err.message = JSON.stringify(err.message).match(regex)
            if (err.statusCode === 417) { 
                err.message = "Validation Error: " + JSON.stringify(err.message).match(regex2)[1]
                throw err
            }
            else { throw err}
            })
    })
}
/**
 * Create a Salary Structure
 * For param follow https://frappe.github.io/erpnext/current/models/hr/salary_structure
 */

ERPNext.prototype.createSalaryStructure= async function(object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(async function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Salary Structure",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(async function (res) {
            res = await JSON.parse(res);
            return res.data;
        }).catch  (async err => { 
            err = await err

            var regex = /Traceback .*<\/pre>/gi;
            var regex2 = /Duplicate entry '(.*)' for/;
            err.message = JSON.stringify(err.message).match(regex)
            //console.log("rexex 1 in lib :" + JSON.stringify(err.message))
   
            if (err.statusCode === 409) { 
                err.message = "Duplicate Entry on " + JSON.stringify(err.message).match(regex2)[1]
                throw err
            }
            else { throw err}
            })
    })
}
/**
 * Create a Salary Component
 * For param follow https://frappe.github.io/erpnext/current/models/hr/salary_component
 */

ERPNext.prototype.createSalaryComponent = async function(object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(async function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Salary Component",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(async function (res) {
            res = await JSON.parse(res);
            return res.data;
        }).catch  (async err => { 
            err = await err

            var regex = /Traceback .*<\/pre>/gi;
            var regex2 = /Duplicate entry '(.*)' for/;
            err.message = JSON.stringify(err.message).match(regex)
            //console.log("rexex 1 in lib :" + JSON.stringify(err.message))
   
            if (err.statusCode === 409) { 
                err.message = "Duplicate Entry on " + JSON.stringify(err.message).match(regex2)[1]
                throw err
            }
            else { throw err}

            })
    })
}
/**
 * Create a Holiday list
 * For param follow https://frappe.github.io/erpnext/current/models/hr/holiday_list
 */

ERPNext.prototype.createHolidayList = async function(object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    var temperr
    return _this.login().then(async function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Holiday List",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(async function (res) {
            res = await JSON.parse(res);
            //console.log("response from create holiday list :" + res.data)
            return res.data;
        }).catch  (async err => { 
            err = await err // its already JSON?
            var regex = /Traceback .*<\/pre>/gi;
            err.message = JSON.stringify(err.message).match(regex)
            //console.log("lib err match regex :" + err.message)
            throw err
            })
    })
}

/**
 * Create a Sales Invoice.
 * For param follow https://frappe.github.io/erpnext/current/models/accounts/sales_invoice
 * @param {Object} object Sales Invoice  object.
 * @return {Promise} resolve Created Sales Invoice.
 */

ERPNext.prototype.createSalesInvoice = function(object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Sales Invoice",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (SalesInvoice ) {
            SalesInvoice = JSON.parse(SalesInvoice);
            return SalesInvoice.data;
        }).catch  (async err => { 
            err = await err
            if (err.statusCode === 409) { return null }
            else { throw err}
            })
    })
}


/**
 *  Will Call REST API to get Sales Invoice by name
 *  @param {String} name name of the customer.
 */

ERPNext.prototype.getSalesInvoiceByTitle = async function (req) {
    var _this = await this;
    var params = '[["Sales Invoice","title","=",' + JSON.stringify(req) +  ']]';
    return _this.login().then(async function () {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Sales%20Invoice?filters=" + params,
            jar: _this.cookieJar,
        }).then(async function (invoice) {
            invoice = await JSON.parse(invoice)
            return invoice.data;
        }).catch  (async err => { 
            err = await err
            if (err.statusCode === 404) { return null }
            else { throw err}
            })
    });
}

/**
 *  Will Call REST API get geo/Country by Code
 */

ERPNext.prototype.getCountryByCode = function (code) {
    var _this = this;
    var params = '[["Country","code","=",' + JSON.stringify(code) + ']]';
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Country?filters=" + params,
            jar: _this.cookieJar,
        }).then(function (country_name) {
            country_name = JSON.parse(country_name);
            if (country_name.data[0] != null) {
                country_name = country_name.data[0].country_name;
                console.log("getCountryByCode:" + country_name)
                return (country_name);
                }
            else { return null;}
        });
    });
}

/**
 *  Will Call REST API to create customer.
 *  for parameters follow https://frappe.github.io/erpnext/current/models/selling/customer
 *  @param  {Object} customerData customer data object.
 *  @return {Promise} resolve with customer data.
 */

ERPNext.prototype.createCustomer = function (object) {
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Customer",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}

/**
 *  Will Call REST API to create Contact
 *  https://frappe.github.io/frappe/current/models/email/contact
 */

ERPNext.prototype.createContact = function (object) {
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Contact",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (contact) {
            contact= JSON.parse(contact);
            return contact.data;
        })
    })
}

/**
 *  Will Call REST API to create Address
 *  https://frappe.github.io/frappe/current/models/geo/address
 */

ERPNext.prototype.createAddress = function (object) {
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Address",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (address) {
            address= JSON.parse(address);
            return address.data;
        })
    })
}


/**
 *  Will Call REST API to create Terms & conditions
 *  https://frappe.github.io/erpnext/current/models/setup/terms_and_conditions
 */

ERPNext.prototype.createTC = function (object) {
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Terms%20and%20Conditions",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (mode) {
            mode = JSON.parse(mode);
            return mode.data;
        })
    })
}

//// no use! it seems like mode of payment account is meant for POS?
// /**
//  *  Will Call REST API to create Mode of payment Account
//  *  https://frappe.github.io/erpnext/current/models/accounts/mode_of_payment_account
//  */

// ERPNext.prototype.createModeofPaymentAccount = function (object) {
//     var _this = this;
//     var formData = querystring.stringify({ data: JSON.stringify(object) });
//     var contentLength = formData.length;
//     return _this.login().then(function (res) {
//         return requestPromise.post({
//             url: _this.baseUrl + "/api/resource/Mode%20of%20Payment%20Account",
//             jar: _this.cookieJar,
//             body: formData,
//             headers: {
//                 'Content-Length': contentLength,
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             }
//         }).then(function (mode) {
//             mode = JSON.parse(mode);
//             return mode.data;
//         })
//     })
// }

// /**
//  *  Will Call REST API to create Mode of payment
//  *  https://frappe.github.io/erpnext/current/models/accounts/mode_of_payment
//  */

// ERPNext.prototype.createModeofPayment = function (object) {
//     var _this = this;
//     var formData = querystring.stringify({ data: JSON.stringify(object) });
//     var contentLength = formData.length;
//     return _this.login().then(function (res) {
//         return requestPromise.post({
//             url: _this.baseUrl + "/api/resource/Mode%20of%20Payment",
//             jar: _this.cookieJar,
//             body: formData,
//             headers: {
//                 'Content-Length': contentLength,
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             }
//         }).then(function (mode) {
//             mode = JSON.parse(mode);
//             return mode.data;
//         })
//     })
// }
/**
 *  Will Call REST API to create Customer group
 *  https://frappe.github.io/erpnext/current/models/setup/customer_group
 */

ERPNext.prototype.createCustomerGroup = function (object) {
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Customer%20Group",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customergroup) {
            customergroup = JSON.parse(customergroup);
            return customergroup.data;
        })
    })
}
/**
 * Create item price
 * https://frappe.github.io/erpnext/current/models/stock/item_price
 */

ERPNext.prototype.createItemPrice = function(object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Item%20Price",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (itemprice) {
            itemprice = JSON.parse(itemprice);
            return itemprice.data;
        })
    })
}

/**
 * Create an Item.
 * For https://frappe.github.io/erpnext/current/models/stock/item
 * @param {Object} object item object.
 * @return {Promise} resolve Created item.
 */

ERPNext.prototype.createItem = function(object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Item",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (item) {
            item = JSON.parse(item);
            return item.data;
        })
    })
}


/**
 *  Will Call REST API to create Item Group
 *  https://frappe.github.io/erpnext/current/models/setup/item_group
 */

ERPNext.prototype.createItemGroup = function (object) {
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Item%20Group",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (itemgroup) {
            itemgroup = JSON.parse(itemgroup);
            return itemgroup.data;
        })
    })
}
/**
 *  Will Call REST API to create Account for accounting
 *  https://frappe.github.io/erpnext/current/models/accounts/account
 */

ERPNext.prototype.createAccount = function (object) {
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Account",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (account) {
            account = JSON.parse(account);
            return account.data;
        })
    })
}

/**
 *  Will Call REST API to create Cost Center
 *  https://frappe.github.io/erpnext/current/models/accounts/cost_center
 */

ERPNext.prototype.createCostCenter = function (object) {
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Cost%20Center",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (costcenter) {
            costcenter = JSON.parse(costcenter);
            return costcenter.data;
        })
    })
}

/**
 *  Will Call REST API to create Price list
 *  https://frappe.github.io/erpnext/current/models/stock/price_list
 */

ERPNext.prototype.createPriceList = function (object) {
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Price%20List",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (pricelist) {
            pricelist = JSON.parse(pricelist);
            return pricelist.data;
        })
    })
}

/**
 *  Will Call REST API to get UOM list
 */

ERPNext.prototype.getUoms = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/UOM",
            jar: _this.cookieJar,
        }).then(function (uoms) {
            uoms= JSON.parse(uoms)
            return uoms.data;
        });
    });
}


/**
 *  Will Call REST API to create UOM
 *  https://frappe.github.io/erpnext/current/models/setup/uom
 */

ERPNext.prototype.createUom = function (object) {
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/UOM",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (uom) {
            uom = JSON.parse(uom);
            return uom.data;
        })
    })
}


/**
 *  Will Call REST API get LeadSource by name
 */

ERPNext.prototype.getLeadSourceName = function (source_name) {
    var _this = this;
    var params = '[["Lead Source","source_name","=",' + JSON.stringify(source_name) + ']]';
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Lead%20Source?filters=" + params,
            jar: _this.cookieJar,
        }).then(function (source_name) {
            source_name = JSON.parse(source_name);
            if (source_name.data[0] != null) {
                source_name = source_name.data[0].name;
                console.log("getLeadSourceName:" + source_name)
                return (source_name);
                }
            else { return null;}
        });
    });
}

/**
 *  Will Call REST API to create lead source
 *  https://frappe.github.io/erpnext/current/models/selling/lead_source
 */

ERPNext.prototype.createLeadSource = function (object) {
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Lead%20Source",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (leadsource) {
            leadsource = JSON.parse(leadsource);
            return leadsource.data;
        })
    })
}

/**
 *  Will Call REST API to delete lead source by
 */

ERPNext.prototype.deleteLeadSource = function (name) {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.delete({
            url: _this.baseUrl + "/api/resource/Lead Source/" + name,
            jar: _this.cookieJar,
        }).then(function (leadsource) {
            leadsource = JSON.parse(leadsource);
            console.log(leadsource)
            return leadsource.data;
        })
    });
}

/**
 *  Will Call REST API to create terrority
 *  https://frappe.github.io/erpnext/current/models/setup/territory
 */

ERPNext.prototype.createTerritory = function (object) {
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Territory",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (territory) {
            territory = JSON.parse(territory);
            return territory.data;
        })
    })
}

/**
 *  Will Call REST API to create lead
 *  for parameters https://frappe.github.io/erpnext/current/models/crm/lead
 */

ERPNext.prototype.createLead = function (object) {
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Lead",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (lead) {
            lead = JSON.parse(lead);
            return lead.data;
        })
    })
}

/**
 *  Will Call REST API to get Opportunity list.
 *  @return {Promise} resolve Opportunitylist.
 */

ERPNext.prototype.getLeads = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Lead",
            jar: _this.cookieJar,
        }).then(function (lead) {
            lead = JSON.parse(lead);
            return lead.data;
        });
    });
}

/**
 *  Will Call REST API to get lead name from lead_name
 *  @return {Promise} resolve Opportunitylist.
 */

ERPNext.prototype.getLeadName = function (lead_name) {
    var _this = this;
    var params = '[["Lead","lead_name","=",' + JSON.stringify(lead_name) + ']]';
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Lead?filters=" + params,
            jar: _this.cookieJar,
        }).then(function (leadName) {
            leadName = JSON.parse(leadName);
            leadName = leadName.data[0].name;
            console.log("getLeadName:" + leadName)
            return (leadName);
        });
    });
}
/**
 *  Will Call REST API to delete lead 
 */

ERPNext.prototype.deleteLead = function (name) {
    var _this = this;
    return _this.login().then(function (res) {
        console.log("deleteLead trying:" + name)
        return requestPromise.delete({
            url: _this.baseUrl + "/api/resource/Lead/" + name,
            jar: _this.cookieJar,
        }).then(function (lead) {
            console.log("deleteLead:" + lead)
            lead = JSON.parse(lead);
            return lead.data;
        })
    });
}




/**
 *  Will Call REST API to create Opportunity.
 *  for parameters follow https://frappe.github.io/erpnext/current/models/crm/opportunity
 *  @param  {Object} opportunityData Opportunity data object.
 *  @return {Promise} resolve with Opportunity data.
 */

ERPNext.prototype.createOpportunity = function (object) {
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Opportunity",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (opportunity) {
            opportunity = JSON.parse(opportunity);
            return opportunity.data;
        })
    })
}



/**
 *  Will Call REST API to get Opportunity list.
 *  @return {Promise} resolve Opportunitylist.
 */

ERPNext.prototype.getOpportunityName = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Opportunity",
            jar: _this.cookieJar,
        }).then(function (opportunity) {
            customers = JSON.parse(opportunity);
            return opportunity.data;
        });
    });
}

/**
 *  Will Call REST API to get Opportunity detail by name.
 *  @param {String} name name of the Opportunity.
 */

ERPNext.prototype.getOpportunityByName = function (name) {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Opportunity/" + name,
            jar: _this.cookieJar,
        }).then(function (opportunity) {
            customer = JSON.parse(opportunity);
            return opportunity.data;
        })
    });
}


/**
 * Get Opportunity info array
 * @return {Promise} resolve with array of clients info
 */

ERPNext.prototype.getOpportunity = function () {
    var _this = this;
    return _this.getOpportunityName().then(function (opportunity) {
        return Promise.map(opportunity, function (opportunity) {
            return _this.getOpportunityByName(opportunity.name);
        });
    })
}

/**
 *  Update Opportunity by name.
 *  @param  {String} name name of the Opportunity.
 *  @param  {Object} object data to be update.
 *  @return {Promise} resolve with Opportunity data.
 */

ERPNext.prototype.updateOpportunityByName = function(name, object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Opportunity/"+ name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (opportunity) {
            customer = JSON.parse(opportunity);
            return opportunity.data;
        })
    })
}



/**
 *  Will Call REST API to get customer list.
 *  @return {Promise} resolve customer list.
 */

ERPNext.prototype.getCustomersName = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Customer",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        })
    });
}

/**
 *  Will Call REST API to get Customer detail by name.
 *  @param {String} name name of the customer.
 */

ERPNext.prototype.getCustomerByName = async function (req) {
    var _this = await this;
    return _this.login().then(function () {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Customer/" + req,
            jar: _this.cookieJar,
        }).then(function (customer) {
            customer = JSON.parse(customer)
            return customer.data;
        }).catch  (err => { 
            if (err.statusCode === 404) { return null }
            else { throw err}
            })
    });
}




//////// BELOW IS 3rd party original code, above have been tested and modified

/**
 * Get Customer info array
 * @return {Promise} resolve with array of clients info
 */

ERPNext.prototype.getCustomers = function () {
    var _this = this;
    return _this.getCustomersName().then(function (customers) {
        return Promise.map(customers, function (customer) {
            return _this.getCustomerByName(customer.name);
        });
    })
}

/**
 *  Update Customer by name.
 *  @param  {String} name name of the customer.
 *  @param  {Object} object data to be update.
 *  @return {Promise} resolve with customer data.
 */

ERPNext.prototype.updateCustomerByName = function(name, object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Customer/"+ name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}




/**
 * Create Customer Group.
 * For param follow https://frappe.github.io/erpnext/current/models/setup/customer_group
 * @param {Object} object customer group data.
 * @return {Promise} resolve with customer group data. 
 */

ERPNext.prototype.createCustomerGroup = function(object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Customer Group",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}


/**
 * Update Customer Group by name.
 * For param follow https://frappe.github.io/erpnext/current/models/setup/customer_group
 * @param {String} name customer group name.
 * @param {Object} object customer group data.
 * @return {Promise} resolve with customer group data. 
 */

ERPNext.prototype.updateCustomerGroupByName = function(name, object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Customer Group/"+name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customerGroup) {
            customerGroup = JSON.parse(customerGroup);
            return customerGroup.data;
        })
    })
}


/**
 * Get Customer Group's name.
 * For param follow https://frappe.github.io/erpnext/current/models/setup/customer_group
 * @param {Object} object customer group data.
 * @return {Promise} resolve with customer group data. 
 */

ERPNext.prototype.getCustomerGroupsName = function(){
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Customer Group",
            jar: _this.cookieJar,
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}

/**
 * Get Customer Group's info by name.
 * For param follow https://frappe.github.io/erpnext/current/models/setup/customer_group
 * @param {String} name customer group's name.
 * @return {Promise} resolve with customer group data.
 */

ERPNext.prototype.getCustomerGroupByName = function(name){
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Customer Group/"+ name,
            jar: _this.cookieJar,
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}

/**
 *  Get Customer Group's info array.
 *  @return {Promise} resolve customer group data array.
 */

ERPNext.prototype.getCustomerGroups = function(){
    var _this = this;
    return _this.getCustomerGroupsName().then(function (customersGroups) {
        return Promise.map(customersGroups, function (group) {
            return _this.getCustomerGroupByName(group.name);
        });
    })
}


/**
 *  Get Sales Order's name array.
 *  @return {Promise} resolve customer group data array.
 */

ERPNext.prototype.getSalesOrdersName = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Sales Order",
            jar: _this.cookieJar,
        }).then(function (salesOrder) {
            salesOrder = JSON.parse(salesOrder);
            return salesOrder.data;
        })
    })
}


/**
 *  Get Sales Order's name array.
 *  @param {String} name name of the sales order
 *  @return {Promise} resolve customer group data array.
 */

ERPNext.prototype.getSalesOrderByName = function (name) {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Sales Order/"+name,
            jar: _this.cookieJar,
        }).then(function (salesOrder) {
            salesOrder = JSON.parse(salesOrder);
            return salesOrder.data;
        })
    })
}


/**
 * Get Sales Order info array.
 * @return {Promise} resolve Sales Orders array list.
 */

ERPNext.prototype.getSalesOrder = function(){
    var _this = this;
    return _this.getSalesOrdersName().then(function (salesOrders) {
        return Promise.map(salesOrders, function (saleOrder) {
            return _this.getSalesOrderByName(saleOrder.name);
        });
    })
}


/**
 * Create Sales Order.
 * For param follow https://frappe.github.io/erpnext/current/models/selling/sales_order
 * @param {Object} object Sales Order.
 * @return {Promise} resolve Created Sales Order.
 */

ERPNext.prototype.createSalesOrder = function(object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Sales Order",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (salesOrder) {
            salesOrder = JSON.parse(salesOrder);
            return salesOrder.data;
        })
    })
}


/**
 * Update Sales Order by name.
 * For param follow https://frappe.github.io/erpnext/current/models/selling/sales_order
 * @param {String} name name of the sales order.
 * @param {Object} object data of sales order.
 * @return {Promise} resolve Created Sales Order.
 */

ERPNext.prototype.updateSalesOrderByName = function(name, object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Sales Order/"+name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (salesOrder) {
            salesOrder = JSON.parse(salesOrder);
            return salesOrder.data;
        })
    })
}


/**
 * Update an Item.
 * For param follow https://frappe.github.io/erpnext/current/models/selling/sales_order
 * @param {String} name name of the item.
 * @param {Object} object data of item.
 * @return {Promise} resolve updated item
 */

ERPNext.prototype.updateItemByName = function(name, object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Item/"+name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (item) {
            item = JSON.parse(item);
            return item.data;
        })
    })
}

/**
 * Create a Supplier Type.
 * https://frappe.github.io/erpnext/current/models/setup/supplier_type

 */

ERPNext.prototype.createSupplierType = function(object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Supplier Type",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (Supplier) {
            Supplier = JSON.parse(Supplier);
            return Supplier.data;
        })
    })
}

/**
 * Create a Supplier.
 * For param follow https://frappe.github.io/erpnext/current/models/buying/supplier.
 * @param {Object} object Supplier object.
 * @return {Promise} resolve Created Supplier.
 */

ERPNext.prototype.createSupplier = function(object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Supplier",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (Supplier) {
            Supplier = JSON.parse(Supplier);
            return Supplier.data;
        })
    })
}

/**
 * Update Supplier.
 * For param follow https://frappe.github.io/erpnext/current/models/buying/supplier.
 * @param {String} name name of the Supplier.
 * @param {Object} object data of Supplier.
 * @return {Promise} resolve updated Supplier
 */

ERPNext.prototype.updateSupplierByName = function(name, object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Supplier/"+name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (Supplier) {
            Supplier = JSON.parse(Supplier);
            return Supplier.data;
        })
    })
}

/**
 * Create a Purchase Invoice.
 * For param follow https://frappe.github.io/erpnext/current/models/accounts/purchase_invoice.
 * @param {Object} object Purchase Invoice  object.
 * @return {Promise} resolve Created Purchase Invoice .
 */

ERPNext.prototype.createPurchaseInvoice = function(object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Purchase Invoice",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (PurchaseInvoice ) {
            PurchaseInvoice = JSON.parse(PurchaseInvoice);
            return PurchaseInvoice.data;
        })
    })
}

/**
 * Update Purchase Invoice.
 * For param follow https://frappe.github.io/erpnext/current/models/accounts/purchase_invoice.
 * @param {String} name name of the Purchase Invoice.
 * @param {Object} object data of Purchase Invoice.
 * @return {Promise} resolve updated Purchase Invoice.
 */

ERPNext.prototype.updatePurchaseInvoiceByName = function(name, object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Purchase Invoice/"+name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (PurchaseInvoice) {
            PurchaseInvoice = JSON.parse(PurchaseInvoice);
            return PurchaseInvoice.data;
        })
    })
}

/**
 * Create a Sales Invoice.
 * For param follow https://frappe.github.io/erpnext/current/models/accounts/sales_invoice
 * @param {Object} object Sales Invoice  object.
 * @return {Promise} resolve Created Sales Invoice.
 */

ERPNext.prototype.createSalesInvoice = function(object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Sales Invoice",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (SalesInvoice ) {
            SalesInvoice = JSON.parse(SalesInvoice);
            return SalesInvoice.data;
        })
    })
}

/**
 * Update Sales Invoice.
 * For param follow https://frappe.github.io/erpnext/current/models/accounts/sales_invoice
 * @param {String} name name of the Sales Invoice.
 * @param {Object} object data of Sales Invoice.
 * @return {Promise} resolve updated Sales Invoice.
 */

ERPNext.prototype.updateSalesInvoiceByName = function(name, object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Sales Invoice/"+name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (SalesInvoice) {
            SalesInvoice = JSON.parse(SalesInvoice);
            return SalesInvoice.data;
        })
    })
}

/**
 * Create a Purchase Order.
 * For param follow https://frappe.github.io/erpnext/current/models/buying/purchase_order
 * @param {Object} object Purchase Order object.
 * @return {Promise} resolve Created Purchase Order.
 */

ERPNext.prototype.createPurchaseOrder = function(object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Purchase Order",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (SalesInvoice ) {
            SalesInvoice = JSON.parse(SalesInvoice);
            return SalesInvoice.data;
        })
    })
}

/**
 * Update Purchase Order.
 * For param follow https://frappe.github.io/erpnext/current/models/buying/purchase_order
 * @param {String} name name of the Purchase Order.
 * @param {Object} object data of Purchase Order.
 * @return {Promise} resolve updated Purchase Order.
 */

ERPNext.prototype.updatePurchaseOrderByName = function(name, object){
    var _this = this;
    var formData = querystring.stringify({ data: JSON.stringify(object) });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Purchase Order/"+name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (PurchaseOrder) {
            PurchaseOrder = JSON.parse(PurchaseOrder);
            return PurchaseOrder.data;
        })
    })
}



module.exports = ERPNext;

