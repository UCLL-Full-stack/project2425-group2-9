import { Customer } from '../../model/customer';

test('given: valid values for customer; when: creating customer; then: customer is created with those values.', () => {
    // GIVEN
    const id: undefined | number = 522567;
    const password: string =  "five-tw0-tw0-five-six-seven";
    const securityQuestion: string = "What is your favorite color?";//really??
    const username: string = "leopold522";
    const firstName: string = "Leopold";
    const lastName: string = "Stravinsky";
    const phone: number = 562259129;

    // WHEN
    const customer: Customer = new Customer({ id, password, securityQuestion, username, firstName, lastName, phone });

    // THEN
    expect(customer.getId()).toEqual(id);
    expect(customer.getPassword()).toEqual(password);
    expect(customer.getSecurityQuestion()).toEqual(securityQuestion);
    expect(customer.getUsername()).toEqual(username);
    expect(customer.getFirstName()).toEqual(firstName);
    expect(customer.getLastName()).toEqual(lastName);
    expect(customer.getPhone()).toEqual(phone);
});
