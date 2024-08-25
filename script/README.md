# INSIGHT Bot Scripts

To install dependencies:

```bash
bun install
```

To run:

create file `data.csv` in the certificates folder

and update data inside `generate-data.ts` & `generate-image.ts` files

```bash
bun run ./script/certificates/generate-data.ts
```
```bash
bun run ./script/certificates/generate-image.ts
```
```bash
bun run ./script/broadcast.ts
```