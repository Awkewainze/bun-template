import { zName, zPassword, zUsername } from "@/validations";
import { memo, useCallback, useState } from "react";
import { Link } from "react-router";
import z, { prettifyError } from "zod";
import { Loading } from "./Loading";
import type { Consumer } from "@/types";
import { If } from "./logic";

export type LoginProps = { formType: "Login", onSubmit: (username: string, password: string, setErrorText: Consumer<string>) => Promise<void> };
export type RegisterProps = { formType: "Register", onSubmit: (username: string, password: string, name: string, setErrorText: Consumer<string>) => Promise<void> }
export type LoginOrRegisterProps = LoginProps | RegisterProps;

export const LoginOrRegisterForm = memo(function ({ formType, onSubmit }: LoginOrRegisterProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [errorText, setErrorText] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const preValidate = useCallback(function (): boolean {
		let zFormValidation = z.object({
			username: zUsername,
			password: zPassword
		});
		if (formType === "Register") {
			zFormValidation = zFormValidation.extend({
				name: zName
			});
		}

		const result = zFormValidation.safeParse({ username, password, name });
		if (result.success) {
			return true;
		}

		if (formType === "Login") {
			setErrorText("username or password is invalid");
		} else {
			setErrorText(prettifyError(result.error));
		}

		return false;
	}, [username, password, name, formType]);

	const handleSubmit = useCallback(async function () {
		setSubmitting(true);
		if (!preValidate()) {
			setSubmitting(false);
			return;
		}
		if (formType === "Login") {
			await onSubmit(username, password, setErrorText);
		} else {
			await onSubmit(username, password, name, setErrorText);
		}
		setSubmitting(false);
	}, [username, password, name, formType]);

	return <Loading isLoading={submitting}>
		<div className="login">
			<form>
				<If condition={formType === "Register"}>
					<div>
						<label htmlFor="name">Name</label>
						<input type="text" name="name" id="name" value={name} onChange={e => void setName(e.target.value)} />
					</div>
				</If>
				<div>
					<label htmlFor="username">Username</label>
					<input type="text" name="username" id="username" value={username} onChange={e => void setUsername(e.target.value)} />
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input type="password" name="password" id="password" value={password} onChange={e => void setPassword(e.target.value)} />
				</div>
				<If condition={formType === "Register"}>
					<div>
						<button type="submit" onClick={handleSubmit} disabled={submitting}>Login</button>
					</div>
					<div><Link to="/auth/register">Create new user</Link></div>
				</If>
				<If condition={formType === "Login"}>
					<div>
						<button type="submit" onClick={handleSubmit} disabled={submitting}>Create new user</button>
					</div>
					<div><Link to="/auth/login">Login</Link></div>
				</If>
				<div className="errorText display-linebreak">{errorText}</div>
			</form>
		</div>
	</Loading>;
});
