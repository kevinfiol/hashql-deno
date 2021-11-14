const server = Deno.listen({ port: 8000 });

async function handle(conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    // const url = new URL(requestEvent.request.url);
    await requestEvent.respondWith(
      new Response("hello world", {
        status: 200,
      }),
    );
  }
}

for await (const conn of server) {
  handle(conn);
}