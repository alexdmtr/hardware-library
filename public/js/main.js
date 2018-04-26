//* Add PayPal Email
simpleCart({
  checkout: {
    type: "SendForm",
    url: "/checkoutHardware"
  },
  cartColumns: [
    { attr: 'name', label: 'Name'},
    { view: "decrement" , label: false , text: "-" } ,
    { attr: "quantity" , label: "Qty" } ,
    { view: "increment" , label: false , text: "+" } ,
    { view: "remove" , text: "Remove" , label: false }
  ],
  currency: "GBP"
});

//* Add shopping cart dropdown in header
jQuery(document).ready(function () {
  $('.showCart').on('click', function () {
    $('#cartPopover').slideToggle('fast');
    $('.showCart span.dropdown').toggleClass('fa-chevron-circle-down fa-chevron-circle-up');
  })
});

//* Define spreadsheet URL (make sure you add the #gid=0 for the sheet you want to use)
var googleSheetURI = 'https://docs.google.com/spreadsheets/d/1fKgZy2eKINoR9JHc2LFQzRrGBvUnKNVDLX3CUH4ELSE/edit?usp=sharing&gid=0';

//* Compile the Handlebars template for HR leaders
var HRTemplate = Handlebars.compile($('#hr-template').html());

//* Load products from spreadsheet
$('#products').sheetrock({
  url: googleSheetURI,
  query: "select A,B,C,D,E,F,G",
  rowTemplate: HRTemplate
});
