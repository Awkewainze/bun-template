import { encodeAndSignJWT } from "./helpers";
import { BadRequest, Created, Ok, router, zParseOrBadRequest } from "./helpers";
import { zAccount, zLogin } from "@/validations";

export const authRouter = router({
	"/api/auth/createAccount": {
		async POST(req) {
			const zAccountResult = await zParseOrBadRequest(zAccount, await req.json());

			if (!zAccountResult.isValid) {
				return zAccountResult.response;
			}

			const { username, name, password } = zAccountResult.result;
			try {
				const [userInfo] = await mysql.begin(async tx => {
					const userNameExists = (await tx`SELECT 1 FROM user WHERE username = ${username} LIMIT ${1}`).length > 0;
					if (userNameExists) {
						throw new Error("username is taken");
					}

					const hashedPassword = await Bun.password.hash(password, { algorithm: "argon2id" });

					await tx`INSERT INTO user (username, name, password) VALUES (${username}, ${name}, ${hashedPassword});`;
					const [{ id: newUserId }] = await tx`SELECT LAST_INSERT_ID() AS id;`;

					return await tx`SELECT id as userId, username, name FROM user WHERE id = ${newUserId}`;
				});

				return Created({ token: await encodeAndSignJWT(userInfo) });
			} catch (error: any) {
				return BadRequest({ error: error?.message });
			}
		}
	},

	"/api/auth/login": {
		async POST(req) {
			const zLoginResult = await zParseOrBadRequest(zLogin, await req.json());

			if (!zLoginResult.isValid) {
				return zLoginResult.response;
			}

			const { username, password } = zLoginResult.result;
			const userResult = await mysql`SELECT * FROM user WHERE username = ${username} LIMIT ${1}`;

			if (userResult.length === 0 || !(await Bun.password.verify(password, userResult[0].password, "argon2id"))) {
				if (userResult.length === 0) {
					// No user found, but hash random data instead to help protect against timing attacks
					const randomData = new Uint32Array(64);
					crypto.getRandomValues(randomData);
					await Bun.password.hash(randomData);
				}

				return BadRequest({ error: "Username or Password is invalid" });
			}

			const token = await encodeAndSignJWT({
				userId: userResult[0].id,
				username: userResult[0].username,
				name: userResult[0].name
			});

			return Ok({ token });
		}
	},

	"/auth/oauth2/callback": {
		async GET(req) {

		}
	}
});
