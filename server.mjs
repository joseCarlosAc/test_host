// cSpell:disable
import randomatic from "randomatic";
import bcrypt from "bcrypt";
import mongoose, { get } from "mongoose";

import express from "express";
import chalk from "chalk";
import cors from "cors";

//IMPORTAMOS ESTOS:
import url from "url";
import path from "path";
//-----------------

import ascii_cats from "ascii-cats";

//AGREGAMOS ESTAS CONSTANTES
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
//_--------------

let mongoConnection = "mongodb+srv://admin:IpQnoc0Vjl5hZxvL@purple_2048.ap4rwmw.mongodb.net/Purple_2048";
let db = mongoose.connection;

db.on("connecting", () => {
	console.log(chalk.blue("connecting"));
});

db.on("connected", () => {
	console.log(chalk.green("connected"));
});

const app = express();
const port = 4000;

let userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	saveBoards: {
		type: [],
	},
	bests: {
		type: [],
	},
	leader: {
		type: Number,
		default: 0,
	},
	token: {
		type: String,
	},
});
let User = mongoose.model("users", userSchema);

//USAMOS EL DIRNAME:
app.use(express.static(__dirname));
//--------------------------------

app.use(
	cors({
		methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
	})
);

function log_users(req, res, next) {
	console.log(chalk.blue("Método: "), chalk.green(req.method));
	console.log(chalk.blue("Url:"), chalk.green(req.originalUrl));
	console.log(chalk.blue("Fecha:"), chalk.green(new Date(Date.now()).toString()));
	console.log(chalk.blue("Content-type"), chalk.green(req.get("Content-Type")));
	//Ejecuta la siguiente función
	next();
}

function print_cat(req, res, next) {
	console.log(ascii_cats());
	next();
}

function checkAuth(req, res, next) {
	let auth = req.get("x-auth");
	console.log(auth);
	if (auth) {
		next();
	} else {
		console.log(chalk.red("No autorizado"));
		res.sendStatus(401);
	}
}

app.use(print_cat);

app.use("/users", log_users);

app.use("/users", checkAuth);

app.get("/", (req, res) => {
	console.log(chalk.blue("Entró a la raíz"));
	//res.send('Raíz del sitio');
	res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/users", async (req, res) => {
	try {
		console.log(chalk.blue("Mostrando usuarios:"));
		let x = randomatic("Aa0", "10") + "-";
		let y = bcrypt.hashSync(x, 10);
		console.log(x);

		let z = bcrypt.compareSync(x, y);

		let user = await User.findById("6382aabe652642d0dc4a9578");
		console.log(user);
		let data;
		data = {
			x: x,
			y: y,
			z: z,
			user: user,
		};
		res.send(JSON.stringify(data));
	} catch (error) {
		console.log(error);
		res.status(500);
		res.send("ocurrio un error");
	}
});

app.get("/home", (req, res) => {
	console.log(chalk.green("Entró a Home"));
	res.send("Home del sitio");
});

mongoose.connect(mongoConnection, { useNewUrlParser: true });

app.listen(port, () => {
	console.log("Aplicación de ejemplo corriendo en puerto " + port);
});
