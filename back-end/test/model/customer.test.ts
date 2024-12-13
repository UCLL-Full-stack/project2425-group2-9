import { Customer } from '../../model/customer';

const id: string = "522567";
const password: string = "five-tw0-tw0-five-six-seven";
const username: string = "leopold522";
const firstName: string = "Leopold";
const lastName: string = "Stravinsky";
const phone: string = "562259129";

test('Given valid values for customer; When creating customer; Then customer is created with those values.', () => {
    // GIVEN
    // Values at the top of this file.

    // WHEN
    const customer: Customer = new Customer({ id, password, username, firstName, lastName, phone });

    // THEN
    expect(customer.getId()).toEqual(id);
    expect(customer.getPassword()).toEqual(password);
    expect(customer.getUsername()).toEqual(username);
    expect(customer.getFirstName()).toEqual(firstName);
    expect(customer.getLastName()).toEqual(lastName);
    expect(customer.getPhone()).toEqual(phone);
});

test('Given no password; When creating customer; Then error is thrown.', () => {
    // GIVEN
    // Values at the top of this file.

    // WHEN
    const createCustomer = () => new Customer({ id, password: "", username, firstName, lastName, phone });

    // THEN
    expect(createCustomer).toThrow("Password is required.");
});

test('Given no username; When creating customer; Then error is thrown.', () => {
    // GIVEN
    // Values at the top of this file.

    // WHEN
    const createCustomer = () => new Customer({ id, password, username: "", firstName, lastName, phone });

    // THEN
    expect(createCustomer).toThrow("Username is required.");
});

test('Given no first name; When creating customer; Then error is thrown.', () => {
    // GIVEN
    // Values at the top of this file.

    // WHEN
    const createCustomer = () => new Customer({ id, password, username, firstName: "", lastName, phone });

    // THEN
    expect(createCustomer).toThrow("First name is required.");
});

test('Given no last name; When creating customer; Then error is thrown.', () => {
    // GIVEN
    // Values at the top of this file.

    // WHEN
    const createCustomer = () => new Customer({ id, password, username, firstName, lastName: "", phone });

    // THEN
    expect(createCustomer).toThrow("Last name is required.");
});

test("Given password is less than 8 characters; When creating a new User; Then the right error is thrown.", () => {
    // GIVEN
    // WHEN
    const createCustomer = () => new Customer({ id, password: "abcd", username, firstName, lastName, phone });

    // THEN 
    expect(createCustomer).toThrow("Password must contain at least 8 characters.");
});

test("Given phone invalid phone number; When creating or registering a new Customer; Then the right error message is thrown.", () => {
    // GIVEN
    // WHEN
    const createCustomer = () => new Customer({ id, password, username, firstName, lastName, phone: "+32 2345 5612 1123" });

    // THEN
    expect(createCustomer).toThrow("phone number should be between 8 and 11 characters long. example: 02 345 67 89 or +32 470 12 34 56");
});

test("Given valid values; When setting new phone number; Then phone number is updated.", () => {
    // GIVEN
    const customer = new Customer({ id, password, username, firstName, lastName, phone });
    const newPhone = "123456789";

    // WHEN
    customer.setPhone(newPhone);

    // THEN
    expect(customer.getPhone()).toEqual(newPhone);
});

test("Given valid values; When setting new role; Then role is updated.", () => {
    // GIVEN
    const customer = new Customer({ id, password, username, firstName, lastName, phone });
    const newRole = "ADMIN";

    // WHEN
    customer.setRole(newRole);

    // THEN
    expect(customer.getRole()).toEqual(newRole);
});