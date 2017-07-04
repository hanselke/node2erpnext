var ERPNext = require('./index');

var erpnext = new ERPNext({
    username : 'Administrator',
    password : 'YOURPASSWORD',
    baseUrl : 'http:// or https:// your erpnext instance url'
});

erpnext.updateSalesOrderByName("SO-00001",{
    "status": "Submitted",
    "docstatus" : 1,
    "container_type" : "40 Feet"
  })
.then(function(salesOrder){
    console.log(salesOrder);
})
.catch(function(err){
    console.log('err',err);
})