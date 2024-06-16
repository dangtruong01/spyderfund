# Backend

Running on port 8080

## How to run

- To run the compiled server

    ```bash
    npm run build
    ```

    ```bash
    npm run start
    ```

- To run on dev

    ```bash
    npm run dev
    ```

## Set up database schema

> Note: make sure to build first

1. Create a migration

    ```bash
    npx sequelize-cli migration:generate --name <title of the migration>
    ```

1. In that new migration file, update the up and down


1. Apply the migration

    ```bash
    npx sequelize-cli db:migrate
    ```

## Scripts

### Test login with postman

1. Get nonce

    - Do a post request to `http://localhost:8080/api/users/nonce`
    - With the following body

        ```json
        {
            "ethereumAddress": "{{ethereumAddress}}"
        }
        ```

1. Apply nonce in .env at `NONCE_RECEIVED`

1. Run `scripts/signNonce.js` to get signature

    ```
    node scripts/signNonce.js
    ```

1. Apply signature to authenticate endpoint

    - Do a post request to `http://localhost:8080/api/users/authenticate`
    - With the following body

        ```json
        {
            "ethereumAddress": "{{ethereumAddress}}",
            "signature": "{{signature}}"
        }
        ```