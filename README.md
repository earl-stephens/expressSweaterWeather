## How To Use

### Account Creation

A user can create an account by making a POST request to:
/api/v1/users
Content-Type: application/json
Accept: application/json
The user should include their email, password and password confirmation
in the body of the request.

A successful request will return a 201 status code and an API key for
that user.

## Versions

* Node 10.16.2
* Postgres 11.1
* Express 4.16.4
