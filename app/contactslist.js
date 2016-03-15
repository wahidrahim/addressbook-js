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
  // Validates form data, displays warnings accordingly, returns true if form is valid otherwise false
  //
  var validForm = function() {
    phoneNum  = Number($phone.val().split(' ').join(''));

    if ($fname.val() === '' ||$lname.val() === '' || phoneNum < 0 || isNaN(phoneNum)) {
      if ($fname.val() === '') {
        showWarning('First name must not be empty');
        $fname.val('');
      }
      if ($lname.val() === '') {
        showWarning('Last name must not be empty');
        $lname.val('');
      }
      if (isNaN(phoneNum) || phoneNum <= 0) {
        showWarning('Phone # must be a valid number');
        $phone.val('');
      }
      return false;
    }
    else {
      return true;
    }
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
        fname: $fname.val().trim(),
        lname: $lname.val().trim(),
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
// The ContactsList object contains all the necessary functions for adding, deleting
// and sorting contacts, as well as manipulating the multiselect (contacts list)
//
var ContactsList = (function() {
  //
  // Contacts array to contain all contacts, included are some premade contacts for testing
  //
  var contacts = [{
    id: 1,
    fname: 'jon',
    lname: 'smith',
    phone: 4165551234
  },{
    id: 2,
    fname: 'jane',
    lname: 'doe',
    phone: 6475554321
  },{
    id: 3,
    fname: 'wahid',
    lname: 'rahim',
    phone: 2227001337
  },{
    id: 4,
    fname: 'clark j.',
    lname: 'kent',
    phone: 2960011938
  },{
    id: 5,
    fname: 'bruce',
    lname: 'wayne',
    phone: 7382930424
  }];
  //
  // ID to assign the next contact, then it is incremented by one
  //
  var newID = contacts.length + 1;
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
    var separator = ' ' + addLine(name, 17) + ' 📱 ';
    var $option = $('<option>', {
      value: contact.id,
      text: name + separator + contact.phone
    });

    return $option;
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
  // Add a formatted contact to the ContactsList
  //
  var add = function(contact) {
    contact.id = newID;
    contacts.push(contact);
    refresh();
    newID++;
  }
  //
  // Delete an existing contact from the ContactsList
  //
  var remove = function(deleteID) {
    var index;

    contacts.map(function(contact, i) {
      if (contact.id == deleteID) {
        index = i;
        return;
      }
    });
    contacts.splice(index, 1);
    refresh();
  }
  //
  // Sort ContactsList contacts according to sortBy parameter
  //
  var sort = function(sortBy) {
    if (sortBy === 'fname') {
      contacts.sort(function(a, b) { return a.fname.localeCompare(b.fname); });
    }
    else if (sortBy === 'lname') {
      contacts.sort(function(a, b) { return a.lname.localeCompare(b.lname); });
    }
    else {
      contacts.sort(function(a, b) { return a.phone - b.phone; });
    }
    refresh();
  }
  //
  // Populate the multiselect on initilization
  //
  refresh();
  //
  // Public interface for ContactsList
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
    ContactsList.add(contact);
    FormUtils.clearForm();
  }
});
//
// Delete button handler
//
$('#contactDelete').click(function() {
  $('#contactSelect').find('option:selected').each(function(index, option) {
    var deleteID = $(option).val();

    ContactsList.remove(deleteID);
  });
});
//
// Sort buttons handlers
//
$('#contactSortFname').click(function() { ContactsList.sort('fname'); });
$('#contactSortLname').click(function() { ContactsList.sort('lname'); });
$('#contactSortPhone').click(function() { ContactsList.sort(); });
