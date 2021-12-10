# HashQL on Deno Deploy

A [HashQL](https://github.com/HashQL/HashQL) server running on [Deno Deploy](https://deno.com/deploy/). Very experimental and not well tested.

HashQL requests are JSON bodies in the form of:

```json
{
    "tag": "sql",
    "hash": "b64f49553d5c441652e95697a2c5949e",
    "input": [{"value": "first param"}, {"value": 2}]
}
```