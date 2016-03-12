//
// contacts array to contain all contacts.
// here are some dummy contacts for testing
//
var contacts = [{
  fname: 'Jon',
  lname: 'Smith',
  phone: 4165551234
},{
  fname: 'Jane',
  lname: 'Doe',
  phone: 6475554321
},{
  fname: 'Wahid',
  lname: 'Rahim',
  phone: 2262205920
}];
//
// returns a jQuery option element
// filled with appropriate contact information
//
var contactOption = function(contact) {
  var $option = $('<option>', {
    value: contact.phone,
    text: contact.phone + ' - ' + contact.fname + ' ' + contact.lname
  });

  return $option;
}
//
// populate multiselect with existing contacts
//
var fillAddressBook = function() {
  $('#contactSelect').find('option').remove();

  contacts.forEach(function(contact) {
    $('#contactSelect').append(contactOption(contact));
  });
}
//
// clears form and unfocuses from input elements
//
var clearForm = function() {
  $('input#firstName').val('').blur();
  $('input#lastName').val('').blur();
  $('input#phone').val('').blur();
}
//
// returns true if num is a valid 10-digit number
//
var isPhoneNum = function(num) {
  if (!isNaN(num) && num.toString().length === 10)
    return true;
  else
    return false;
}
//
// show form validation warnings
//
var showWarning = function(warning) {
  $('#warnings').append($('<li>', {
    text: warning
  }));
}
//
// remove any existing warnings
//
var clearWarnings = function() {
  $('#warnings').empty();
}

//
// validates form data and displays warnings accordingly
//
var validForm = function($fname, $lname, $phone, phoneNum) {
  // form validations
  if ($fname.val() === '' || $lname.val() === '' || !isPhoneNum(phoneNum)) {
    if ($fname.val() === '') {
      showWarning('First name must not be empty');
      $fname.val('');
    }
    if ($lname.val() === '') {
      showWarning('Last name must not be empty');
      $lname.val('');
    }
    if (!isPhoneNum(phoneNum)) {
      showWarning('Phone # must be a valid 10-digit number');
      $phone.val('');
    }
    return false;
  }
  else {
    return true;
  }
}
//
// handles form submissions: adds a new contact
// to the address book
//
$('#contactForm').submit(function(event) {
  event.preventDefault();
  clearWarnings();

  var $fname = $('input#firstName');
  var $lname = $('input#lastName');
  var $phone = $('input#phone');
  var phoneNum = Number($phone.val().split(' ').join(''));

  // run validations and add if and only if inputs are valid
  if (validForm($fname, $lname, $phone, phoneNum)) {
    var contact = {
      fname: $fname.val(),
      lname: $lname.val(),
      phone: phoneNum
    }

    // add to addrses book
    contacts.push(contact);
    $('#contactSelect').append(contactOption(contact));

    // reset the form
    clearForm();
    return;
  }
});
//
// returns the index of a contact object
// determined by the phone number of the contact
// which is assumed to be unique
//
var indexOfContact = function(phone) {
  var index = contacts.findIndex(function(contact) {
    return contact.phone === phone;
  });

  return index;
}
//
// 'delete' button handler
//
$('#contactDelete').click(function(event) {
  var toDelete = $('#contactSelect').find('option:selected');

  toDelete.each(function(index, option) {
    var phoneNum = Number($(option).val());
    // remove contact from array
    contacts.splice(indexOfContact(phoneNum), 1);
  })

  fillAddressBook(contacts);
});
//
// 'sort by first name' button handler
//
$('#contactSortFname').click(function(event) {
  contacts.sort(function(a, b) {
    return a.fname.localeCompare(b.fname);
  });

  fillAddressBook(contacts);
});
//
// 'sort by last name' button handler
//
$('#contactSortLname').click(function(event) {
  contacts.sort(function(a, b) {
    return a.lname.localeCompare(b.lname);
  });

  fillAddressBook(contacts);
});
//
// 'sort by phone number' button handler
//
$('#contactSortPhone').click(function(event) {
  contacts.sort(function(a, b) {
    return a.phone - b.phone;
  });

  fillAddressBook(contacts);
});

// populating addrss book with dummy contacts
fillAddressBook(contacts);
