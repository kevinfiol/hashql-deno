import { Application, Router } from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';

import config from './config.js'
import HashQL from './hashql.js';
import * as postgres from "https://deno.land/x/postgres@v0.14.2/mod.ts";

const hqlPool = new postgres.Pool(config.hql, 3, true);
let dbPool = undefined;

if (
  config.hql.hostname != config.postgres.hostname ||
  config.hql.database != config.postgres.database
) {
    dbPool = new postgres.Pool(config.postgres, 3, true);
} else {
    dbPool = hqlPool;
}

async function HQLGetter(hash, tag) {
    const conn = await hqlPool.connect();

    const res = await conn.queryObject`
        select query from queries
        where tag = ${ tag }
        and hash = ${ hash }
    `;

    conn.release();

    if (res.rows.length && res.rows[0].query) {
        return res.rows[0].query;
    }

    return [];
}

const hql = HashQL(HQLGetter, {
    sql: async (query, input, _context) => {
        let increment = 1;

        // TODO: this is probably error-prone; needs more testing
        for (let i = 0, len = input.length; i < len; i++) {
            query.splice(i + increment, 0, `$${increment}`);
            increment += 1;
        }

        const conn = await dbPool.connect();
        const res = await conn.queryObject(query.join(''), ...input);
        conn.release();
        return res.rows;
    }
});

const router = new Router();
const app = new Application();

router
    .post('/hql', async (ctx) => {
        const body = await ctx.request.body({ type: 'json' }).value;
        const payload = { error: null, data: { rows: [] } };

        try {
            const rows = await hql(body);
            payload.data.rows = rows;
        } catch (e) {
            console.error(e);
            payload.error = e.message;
        }

        ctx.response.body = payload;
    })
;

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', () => console.log(`listening on port ${config.port}`));
await app.listen({ port: Number(config.port) });
