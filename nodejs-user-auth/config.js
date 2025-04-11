export const {
    PORT = 3000,
    SALT_ROUNDS = 10, //<- 10 es el numero de vueltas que se le va a dar al password
    SECRET_JWT_KEY = "this-is-an-incredible-secret-key-#$EQ#QDADWQwaasd11111222-and-a-lot-secureasdsadsafsasadasd",
} = process.env;
