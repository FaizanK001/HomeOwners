const csv = require('csv-parser');
const fs = require('fs');

// This function takes a person's name as input and returns their title, first name, initial, and last name.
function parsePersonName(name) {
  if (!name) {
    return null;
  }
  name = name.trim();
  let parts = name.split(' ');
  let title = null;
  let first_name = null;
  let initial = null;
  let last_name = null;

  if (["Mr", "Mrs", "Ms", "Miss", "Dr", "Mister", "Prof"].includes(parts[0])) {
    title = parts[0];
    parts = parts.slice(1);
  }

  // Determine the person's first name, initial, and last name based on the number of name parts.
  if (parts.length == 1) {
    if (parts[0].length == 1) { // check if first name has max 2 characters
      initial = parts[0];
      last_name = parts[1];
    } else {
      first_name = parts[0];
      last_name = parts[0];
    }
  } else if (parts.length == 2) {
    first_name = parts[0];
    last_name = parts[1];
  } else if (parts.length == 3) {
    first_name = parts[0];
    initial = parts[1];
    last_name = parts[2];
  } else {
    first_name = parts.slice(0, -1).join(' ');
    last_name = parts[parts.length - 1];
  }

  // If the name contains "and" or "&", it is assumed to contain multiple people's names and is split accordingly.
  if (name && (name.includes("and") || name.includes("&"))) {
    const names = name.split(/ and | & /);
    const people = [];
    names.forEach(fullName => {
      const nameParts = fullName.trim().split(' ');
      const title = nameParts[0];
      const firstName = nameParts.length > 2 ? nameParts[1] : null;
      const lastName = nameParts[nameParts.length - 1];
      const person = {
        "title": title,
        "first_name": firstName,
        "initial": null,
        "last_name": lastName,
      };
      people.push(person);
    });

    return people;
  } else if (initial || initial === "" || first_name) {
    if (first_name && first_name.length <= 2) {
      initial = first_name;
      first_name = null;
    }
    return {
      "title": title,
      "first_name": first_name,
      "initial": initial,
      "last_name": last_name
    };
  } else {
    return null;
  }
}

// Create an empty array to store the people whose names are parsed from the CSV file.
const people = [];

// Read the CSV file and parse each row's "homeowner" column using the parsePersonName function.
fs.createReadStream('./examples__284_29.csv')
  .pipe(csv())
  .on('data', (row) => {
    const name = row['homeowner'];
    const person = parsePersonName(name);
    if (person) {
      people.push(person);
    }
  })
  .on('end', () => {
console.log(people);
  });
