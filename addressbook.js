//
// Capitalizes the first letter in a string, used for formatting contact names
//
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
//
// Contains all the functions required for manipulating the contact form
//
var FormUtils = (function() {
  var $fname = $('input#firstName');
  var $lname = $('input#lastName');
  var $phone = $('input#phone');
  var phoneNum;
  //
  // Displays a single warning
  //
  var showWarning = function(warning) { $('#warnings').append($('<li>', {text: warning})); }
  //
  // Clears any existing validation warnings
  //
  var clearWarnings = function() { $('#warnings').empty(); }
  //
  // Returns true if form data is invalid
  //
  var invalidForm = function() { 
    return ($fname.val() === '' ||
            $lname.val() === '' || 
            $fname.val().split(' ').length > 1 ||
            $lname.val().split(' ').length > 1 ||
            phoneNum < 0 ||
            isNaN(phoneNum));
  }
  //
  // Validates form data, displays warnings accordingly, returns true if form is valid otherwise false
  //
  var validForm = function() {
    phoneNum  = Number($phone.val().split(' ').join(''));

    if (invalidForm()) {
      if ($fname.val() === '') {
        showWarning('First name must not be empty');
        $fname.val('');
      }
      if ($lname.val() === '') {
        showWarning('Last name must not be empty');
        $lname.val('');
      }
      if ($fname.val().split(' ').length > 1) {
        showWarning('First name must be one word');
        $fname.val('');
      }
      if ($lname.val().split(' ').length > 1) {
        showWarning('Last name must be one word');
        $lname.val('');
      }
      if (isNaN(phoneNum) || phoneNum <= 0) {
        showWarning('Phone # must be a valid number');
        $phone.val('');
      }
      return false;
    }
    else
      return true;
  }
  //
  // Clears the form and unfocuses input elements
  //
  var clearForm = function() {
    $fname.val('').blur();
    $lname.val('').blur();
    $phone.val('').blur();
  }
  //
  // Creates a contact object from valid form data
  //
  var createContact = function() {
    if (validForm()) {
      return {
        fname: $fname.val().trim().capitalize(),
        lname: $lname.val().trim().capitalize(),
        phone: phoneNum
      }
    }
  }
  //
  // Public interface for FormUtils
  //
  return {
    clearForm: clearForm,
    clearWarnings: clearWarnings,
    createContact: createContact
  }
})();
//
// The AddressBook object contains all the necessary functions for adding, deleting
// and sorting contacts, as well as manipulating the multiselect (address book)
//
var AddressBook = (function() {
  //
  // Contacts array to contain all contacts, included are some premade contacts for testing
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
  // Returns a calculated length string line, for visual display purposes
  //
  var addLine = function(name, length) {
    var count = (length - name.length > 1) ? length - name.length : 1;

    return '—'.repeat(count);
  }
  //
  // Returns a jQuery option element filled with appropriate contact information
  //
  var contactOption = function(contact) {
    var name = contact.fname + ' ' + contact.lname;
    var $option = $('<option>', {
      value: contact.phone,
      text: name + ' ' + addLine(name, 15) + ' 📱 ' + contact.phone
    });

    return $option;
  }
  //
  // Returns true if the two contacts a and b have matching fields otherwise false
  //
  var contactsMatch = function(a, b) {
    return a.fname === b.fname && a.lname === b.lname && a.phone === b.phone;
  }
  //
  // Clears the multiselect and re-populate it with the contacts array
  //
  var refresh = function() {
    $('#contactSelect').find('option').remove();
    contacts.map(function(contact) {
      $('#contactSelect').append(contactOption(contact));
    });
  }
  // 
  // Add a formatted contact to the AddressBook
  //
  var add = function(contact) {
    contacts.push(contact);
    refresh();
  }
  //
  // Delete an existing contact from the AddressBook
  //
  var remove = function(deleteContact) {
    var index;

    contacts.map(function(contact, i) {
      if (contactsMatch(contact, deleteContact)) {
        index = i;
        return;
      }
    });
    contacts.splice(index, 1);
    refresh();
  }
  //
  // Sort AddressBook contacts according to sortBy parameter
  //
  var sort = function(sortBy) {
    if (sortBy === 'fname') 
      contacts.sort(function(a, b) { return a.fname.localeCompare(b.fname); });
    else if (sortBy === 'lname')
      contacts.sort(function(a, b) { return a.lname.localeCompare(b.lname); });
    else
      contacts.sort(function(a, b) { return a.phone - b.phone; });

    refresh();
  }
  //
  // Populate the multiselect on initilization
  //
  refresh();
  //
  // Public interface for AddressBook
  //
  return {
    add: add,
    remove: remove,
    sort: sort
  };
})();
//
// Form submission  handler
//
$('#contactForm').submit(function(event) {
  event.preventDefault();
  FormUtils.clearWarnings();

  var contact = FormUtils.createContact();

  if (contact) {
    AddressBook.add(contact);
    FormUtils.clearForm();
  }
});
//
// Delete button handler
//
$('#contactDelete').click(function(event) {
  $('#contactSelect').find('option:selected').each(function(index, option) {
    var strContact = $(option).text().split(' ');

    // removing unnecessary characters
    strContact.splice(2, 2);

    var contact = {
      fname: strContact[0],
      lname: strContact[1],
      phone: Number(strContact[2])
    }

    AddressBook.remove(contact);
  });
});
//
// Sort buttons handlers
//
$('#contactSortFname').click(function(event) { AddressBook.sort('fname'); });
$('#contactSortLname').click(function(event) { AddressBook.sort('lname'); });
$('#contactSortPhone').click(function(event) { AddressBook.sort(); });
