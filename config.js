import "https://deno.land/x/dotenv/load.ts";

export default {
    port: Deno.env.get('PORT'),
    hql: {
        hostname: Deno.env.get('HQL_DB_HOST'),
        port: Deno.env.get('HQL_DB_PORT'),
        database: Deno.env.get('HQL_DB_NAME'),
        user: Deno.env.get('HQL_DB_USER'),
        password: Deno.env.get('HQL_DB_PASSWORD')
    },
    postgres: {
        hostname: Deno.env.get('DB_HOST'),
        port: Deno.env.get('DB_PORT'),
        database: Deno.env.get('DB_NAME'),
        user: Deno.env.get('DB_USER'),
        password: Deno.env.get('DB_PASSWORD')
    }
};