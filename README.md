# Stock management Server

### Stack

NodeJS | Express | Prisma | MongoDB

`cd server`:

1. Run `npm install` for all project dependencies
2. Run `npx prisma generate` to set up all Prisma configs
3. Run `npm run dev` to up the server (server should run on PORT 3300)
4. _Optional_ - run `npx prisma studio` and check if DB is connected

<br>

# Stock management Client

### Stack

ReactJS whit Vite

`cd client`:

#### Create env file:

Run `touch .env` to create a .env file and add this line:

`VITE_API_URL="http://localhost:3300"`

Now client will be able to connect with server

#### Installing and runnint client:

1. Run `npm install`for all project dependencies
2. Run `npm run dev`to start projetc on Vite's default PORT
