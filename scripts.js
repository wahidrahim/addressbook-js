// Capitalizes the first letter in a string, used for formatting contact names
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

// Contains all the functions required for manipulating the contact form
var FormUtils = (function() {
  var $fname = $('input#firstName');
  var $lname = $('input#lastName');
  var $phone = $('input#phone');
  var phoneNum;

  // Displays a single warning
  var showWarning = function(warning) {
    $('#warnings').append($('<li>', {
      text: warning
    }));
  }

  // Returns true if num is a valid 10-digit number
  var isPhoneNum = function(num) {
    return (!isNaN(num) && num.toString().length === 10) ? true : false;
  }

  // Validates form data, displays warnings accordingly, returns true if form is valid otherwise false
  var validForm = function() {
    phoneNum  = Number($phone.val().split(' ').join(''));

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
    else
      return true;
  }

  // Public interface for FormUtils
  return {
    // Clears the form and unfocuses input elements
    clearForm: function() {
      $fname.val('').blur();
      $lname.val('').blur();
      $phone.val('').blur();
    },
    // Clears any existing validation warnings
    clearWarnings: function() {$('#warnings').empty();},
    // Creates a contact object from valid form data
    createContact: function() {
      if (validForm()) {
        return {
          fname: $fname.val(),
          lname: $lname.val(),
          phone: phoneNum
        }
      }
    }
  }
})();

// The AddressBook object contains all the necessary functions for adding, deleting
// and sorting contacts, as well as manipulating the multiselect (address book)
var AddressBook = (function() {
  // Contacts array to contain all contacts,
  // including some premade contacts for testing
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

  // Returns a jQuery option element filled with appropriate contact information
  var contactOption = function(contact) {
    var $option = $('<option>', {
      value: contact.phone,
      text: contact.phone + ' - ' + contact.fname + ' ' + contact.lname
    });
    return $option;
  }

  // Capitalizes the first and last name of the contact before saving to AddressBook
  var formatContact = function(contact) {
    contact.fname = contact.fname.capitalize();
    contact.lname = contact.lname.capitalize();
  }

  // Clears the multiselect and re-populate it with the contacts array
  var refresh = function() {
    $('#contactSelect').find('option').remove();
    contacts.forEach(function(contact) {
      $('#contactSelect').append(contactOption(contact));
    });
  }

  // Populate the multiselect on initilization
  refresh();

  return {
    // Add a formatted contact to the AddressBook
    add: function(contact) {
      formatContact(contact);
      contacts.push(contact);
      refresh();
    },
    // Delete an existing contact from the AddressBook
    delete: function(deleteContact) {
      var index;

      contacts.forEach(function(contact, i) {
        if (contact.fname === deleteContact.fname &&
            contact.lname === deleteContact.lname &&
            contact.phone === deleteContact.phone) {
          index = i;
          return;
        }
      });

      contacts.splice(index, 1);
      refresh();
    },
    // Sort AddressBook contacts according to sortBy parameter
    sort: function(sortBy) {
      if (sortBy === 'fname') {
        contacts.sort(function(a, b) {
          return a.fname.localeCompare(b.fname);
        });
      }
      else if (sortBy === 'lname') {
        contacts.sort(function(a, b) {
          return a.lname.localeCompare(b.lname);
        });
      }
      else {
        contacts.sort(function(a, b) {
          return a.phone - b.phone;
        });
      }
      refresh();
    }
  };
})();

// Form submission  handler
$('#contactForm').submit(function(event) {
  event.preventDefault();
  FormUtils.clearWarnings();

  var contact = FormUtils.createContact();

  if (contact) {
    AddressBook.add(contact);
    FormUtils.clearForm();
  }
});

// Delete button handler
$('#contactDelete').click(function(event) {
  var toDelete = $('#contactSelect').find('option:selected');

  toDelete.each(function(index, option) {
    var strContact = $(option).text().split(' ');

    strContact.splice(1, 1);

    var contact = {
      fname: strContact[1],
      lname: strContact[2],
      phone: Number(strContact[0])
    }

    AddressBook.delete(contact);
  });
});

// Sort buttons handlers
$('#contactSortFname').click(function(event) {AddressBook.sort('fname');});
$('#contactSortLname').click(function(event) {AddressBook.sort('lname');});
$('#contactSortPhone').click(function(event) {AddressBook.sort();});
